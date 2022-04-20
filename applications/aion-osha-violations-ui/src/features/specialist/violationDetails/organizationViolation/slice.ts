import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOrganizationViolation } from 'interfaces/organizationViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'organizationViolation';

const { Equals } = OdataComparator;

export const fetchOrganizationViolation = createAsyncThunk(
  `${name}/fetchOrganizationViolation`,
  async (ssqid: number) => {
    const params = new QueryBuilder().filter(f => f.filterBy('CompanyNumber', Equals, ssqid)).toQueryParam();

    const { data } = await axios.get<OdataResponse<IOrganizationViolation[]>>(
      '/api/oshaViolations/v3.01/organizations',
      {
        params
      }
    );

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { violation: IOrganizationViolation[] | null; total: number } & CommonState;

export const initialState: State = {
  violation: null,
  total: 0,
  isFetching: false,
  error: null
};

const organizationViolation = createSlice({
  name,
  initialState,
  reducers: {
    clearSearch: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchOrganizationViolation.pending, isFetching);
    builder.addCase(fetchOrganizationViolation.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violation = action.payload.data;
    });
    builder.addCase(fetchOrganizationViolation.rejected, (state, action) => {
      state.total = 0;
      state.violation = null;
      error(state, action);
    });
  }
});
export const { clearSearch } = organizationViolation.actions;
export const { reducer: organizationViolationReducer } = organizationViolation;
