import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOrganizationViolations } from 'interfaces/organizationViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'organizationViolations';

const { Equals } = OdataComparator;

export const fetchOrganizationViolations = createAsyncThunk(
  `${name}/fetchOrganizationViolations`,
  async (id: number) => {
    const order = 'matchPercentage desc';
    const params = new QueryBuilder()
      .orderBy(order)
      .filter(f => f.filterBy('oshaViolationId', Equals, id))
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IOrganizationViolations[]>>(
      '/api/oshaViolations/v3.01/organizationViolations',
      {
        params
      }
    );

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { violation: IOrganizationViolations[] | null; total: number } & CommonState;

export const initialState: State = {
  violation: null,
  total: 0,
  isFetching: false,
  error: null
};

const organizationViolations = createSlice({
  name,
  initialState,
  reducers: {
    clearOrganizations: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchOrganizationViolations.pending, isFetching);
    builder.addCase(fetchOrganizationViolations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violation = action.payload.data;
    });
    builder.addCase(fetchOrganizationViolations.rejected, (state, action) => {
      state.total = 0;
      state.violation = null;
      error(state, action);
    });
  }
});
export const { clearOrganizations } = organizationViolations.actions;
export const { reducer: organizationsViolationReducer } = organizationViolations;
