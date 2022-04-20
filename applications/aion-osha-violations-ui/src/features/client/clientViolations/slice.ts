import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';

const name = 'clientViolations';

const { NotEquals, Equals } = OdataComparator;

export const fetchClientViolations = createAsyncThunk(
  `${name}/fetchClientViolations`,
  async ({ page, orderBy, order, pageSize, optionId }: ParsedUrlQuery) => {
    const top = pageSize ? Number(pageSize) : 10;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    const params = new QueryBuilder()
      .top(top)
      .skipByPage(page ? page.toString() : '1', top)
      .orderBy(sortOrder)
      .select(
        'id,citationId,violationType,activityNumber,importedDateUtc,naicsCode,openedDate,matchType,closedDate,oshaCompanyName,state,status,associatedCompanyName,associatedCompanyNumber,associatedMatchPercentage,associatedCompanyId'
      )
      .filter(e => e.filterBy('closedDate', NotEquals, null).filterBy('associatedCompanyId', Equals, optionId))
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IOshaViolations[]>>('/api/oshaViolations/v3.01/oshaViolations', {
      params: params
    });

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { violations: IOshaViolations[] | null; total: number } & CommonState;

export const initialState: State = {
  violations: null,
  total: 0,
  isFetching: false,
  error: null
};

const clientViolations = createSlice({
  name,
  initialState,
  reducers: {
    clearClientSearch: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchClientViolations.pending, isFetching);
    builder.addCase(fetchClientViolations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violations = action.payload.data;
    });
    builder.addCase(fetchClientViolations.rejected, (state, action) => {
      state.total = 0;
      state.violations = null;
      error(state, action);
    });
  }
});
export const { clearClientSearch } = clientViolations.actions;
export const { reducer: clientViolationsReducer } = clientViolations;
