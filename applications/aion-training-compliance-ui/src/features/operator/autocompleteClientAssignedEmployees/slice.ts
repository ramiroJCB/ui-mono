import axios from 'axios';
import { createAsyncThunk, createEntityAdapter, createSlice, SerializedError } from '@reduxjs/toolkit';
import { error, isFetching } from '@pec/aion-ui-core/slices/common';
import { IClientAssignedEmployee } from 'interfaces/clientAssignedEmployee';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';

const name = 'autocompleteClientAssignedEmployees';

type Params = {
  organizationId: string;
  inputValue?: string;
  page?: number;
  top?: number;
};

export const fetchAutocompleteClientAssignedEmployees = createAsyncThunk(
  `${name}/fetchAutocompleteClientAssignedEmployees`,
  async ({ organizationId, inputValue, page = 1, top = 10 }: Params) => {
    const { Contains, Equals } = OdataComparator;
    const params = new QueryBuilder()
      .top(top)
      .skip((page - 1) * top)
      .filter(({ filterBy }) =>
        filterBy('organizationId', Equals, organizationId)
          .filterBy('isDeleted', Equals, false)
          .filterBy('employeeName', Contains, inputValue)
      )
      .orderBy('employeeName')
      .toQueryParam();

    const { data } = await axios.get<{ value: IClientAssignedEmployee[]; '@odata.count': number }>(
      '/api/trainingCompliance/v3.01/clientAssignedEmployees',
      { params }
    );

    const total = data['@odata.count'];
    const payload = data.value;

    return {
      options: payload,
      hasMore: Math.ceil(total / top) > page,
      additional: { page: page + 1, total }
    };
  }
);

export const autocompleteClientAssignedEmployeesAdapter = createEntityAdapter<IClientAssignedEmployee>();
export const autocompleteClientAssignedEmployeesSelectors = autocompleteClientAssignedEmployeesAdapter.getSelectors<
  RootState
>(state => state.autocompleteClientAssignedEmployees);

export type State = {
  isFetching: boolean;
  error: SerializedError | null;
  totalCount: number;
  currentPage: number;
};

export const initialState = autocompleteClientAssignedEmployeesAdapter.getInitialState<State>({
  isFetching: false,
  error: null,
  totalCount: 0,
  currentPage: 1
});

const autocompleteClientAssignedEmployees = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAutocompleteClientAssignedEmployees.pending, isFetching);
    builder.addCase(fetchAutocompleteClientAssignedEmployees.fulfilled, (state, action) => {
      state.isFetching = false;
      state.currentPage = action.payload.additional.page - 1;
      state.totalCount = action.payload.additional.total;
      autocompleteClientAssignedEmployeesAdapter.setAll(state, action.payload.options);
    });
    builder.addCase(fetchAutocompleteClientAssignedEmployees.rejected, error);
  }
});

export const { reducer: autocompleteClientAssignedEmployeesReducer } = autocompleteClientAssignedEmployees;
