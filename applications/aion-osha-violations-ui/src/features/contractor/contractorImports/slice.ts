import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaImport } from 'interfaces/oshaImports';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { ParsedUrlQuery } from 'querystring';

const name = 'contractorImports';

const { Equals } = OdataComparator;

export const fetchContractorImports = createAsyncThunk(
  `${name}/fetchContractorImports`,
  async ({ orderBy, order }: ParsedUrlQuery) => {
    const top = 1;
    const sortOrder = `${orderBy} ${order}`;

    const params = new QueryBuilder()
      .top(top)
      .orderBy(sortOrder)
      .select('runDateTimeUtc')
      .filter(f => f.filterBy('status', Equals, 'Success'))
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IOshaImport[]>>(
      '/api/oshaViolations/v3.01/oshaViolationImportsForContractors',
      {
        params
      }
    );

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { import: IOshaImport[] | null; total: number } & CommonState;

export const initialState: State = {
  import: null,
  total: 0,
  isFetching: false,
  error: null
};

const contractorImports = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchContractorImports.pending, isFetching);
    builder.addCase(fetchContractorImports.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.import = action.payload.data;
    });
    builder.addCase(fetchContractorImports.rejected, (state, action) => {
      state.total = 0;
      state.import = null;
      error(state, action);
    });
  }
});

export const { reducer: contractorImportsReducer } = contractorImports;
