import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';

const name = 'contractorViolations';

const { Equals, NotEquals } = OdataComparator;

interface IFetchParams {
  organizationId: string;
  pageSize: string;
  page: string;
  order: string;
  orderBy: string;
}

export const fetchContractorViolations = createAsyncThunk(
  `${name}/fetchContractorViolations`,
  async ({ organizationId, pageSize, page = '1', order, orderBy }: IFetchParams) => {
    const top = pageSize ? Number(pageSize) : 10;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    const params = new QueryBuilder()
      .top(top)
      .orderBy(sortOrder)
      .skipByPage(page, top)
      .filter(e =>
        e
          .filterBy('associatedCompanyId', Equals, organizationId)
          .filterBy('status', Equals, 'Associated')
          .filterBy('closedDate', NotEquals, null)
      )
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IOshaViolations[]>>('/api/oshaViolations/v3.01/oshaViolations', {
      params
    });

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = {
  violations: IOshaViolations[] | null;
  total: number;
} & CommonState;

export const initialState: State = {
  violations: null,
  total: 0,
  isFetching: false,
  error: null
};

const contractorViolations = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchContractorViolations.pending, isFetching);
    builder.addCase(fetchContractorViolations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.violations = action.payload.data;
      state.total = action.payload.total;
    });
    builder.addCase(fetchContractorViolations.rejected, (state, action) => {
      state.violations = null;
      state.total = 0;
      error(state, action);
    });
  }
});

export const { reducer: contractorViolationsReducer } = contractorViolations;
