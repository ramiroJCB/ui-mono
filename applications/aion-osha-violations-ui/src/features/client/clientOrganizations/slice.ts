import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOrganizationViolation } from 'interfaces/organizationViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'clientOrganizations';

const { Contains, Equals } = OdataComparator;

export const fetchClientOrganizations = createAsyncThunk(
  `${name}/fetchClientOrganizations`,
  async (searchTerm: string) => {
    const searchArray = searchTerm.replace(/[()]/g, '').split(' ');
    const companyNumber = searchArray[searchArray.length - 1];
    const order = 'name asc';

    const params = new QueryBuilder()
      .orderBy(order)
      .filter(f =>
        f
          .filterBy('isActive', Equals, true)
          .filterBy('name', Contains, searchTerm)
          .or(f => f.filterBy('companyNumber', Equals, companyNumber))
      )
      .toQueryParam();

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

type State = { organizations: IOrganizationViolation[] | null; total: number } & CommonState;

export const initialState: State = {
  organizations: null,
  total: 0,
  isFetching: false,
  error: null
};

const clientOrganizations = createSlice({
  name,
  initialState,
  reducers: {
    clearOrganizations: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchClientOrganizations.pending, isFetching);
    builder.addCase(fetchClientOrganizations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.organizations = action.payload.data;
    });
    builder.addCase(fetchClientOrganizations.rejected, (state, action) => {
      state.total = 0;
      state.organizations = null;
      error(state, action);
    });
  }
});
export const { clearOrganizations } = clientOrganizations.actions;
export const { reducer: clientOrganizationsReducer } = clientOrganizations;
