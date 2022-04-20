import axios from 'axios';
import { createAsyncThunk, createEntityAdapter, createSlice, SerializedError } from '@reduxjs/toolkit';
import { error, isFetching } from '@pec/aion-ui-core/slices/common';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';

const name = 'autocompleteWorkGroups';

type Params = {
  organizationId: string;
  inputValue?: string;
  page?: number;
  top?: number;
};

export const fetchAutocompleteWorkGroups = createAsyncThunk(
  `${name}/fetchAutocompleteWorkGroups`,
  async ({ organizationId, inputValue, page = 1, top = 10 }: Params) => {
    const { Contains, Equals } = OdataComparator;
    const params = new QueryBuilder()
      .top(top)
      .skip((page - 1) * top)
      .filter(({ filterBy }) =>
        filterBy('name', Contains, inputValue)
          .filterBy('organizationId', Equals, organizationId)
          .filterBy('isDeleted', Equals, false)
      )
      .orderBy('name')
      .toQueryParam();

    const { data } = await axios.get<{ value: IWorkGroup[]; '@odata.count': number }>(
      '/api/trainingCompliance/v3.01/workGroups',
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

export const autocompleteWorkGroupsAdapter = createEntityAdapter<IWorkGroup>();
export const autocompleteWorkGroupsSelectors = autocompleteWorkGroupsAdapter.getSelectors<RootState>(
  state => state.autocompleteWorkGroups
);

export type State = {
  isFetching: boolean;
  error: SerializedError | null;
  totalCount: number;
  currentPage: number;
};

export const initialState = autocompleteWorkGroupsAdapter.getInitialState<State>({
  isFetching: false,
  error: null,
  totalCount: 0,
  currentPage: 1
});

const autocompleteWorkGroups = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAutocompleteWorkGroups.pending, isFetching);
    builder.addCase(fetchAutocompleteWorkGroups.fulfilled, (state, action) => {
      state.isFetching = false;
      state.currentPage = action.payload.additional.page - 1;
      state.totalCount = action.payload.additional.total;
      autocompleteWorkGroupsAdapter.setAll(state, action.payload.options);
    });
    builder.addCase(fetchAutocompleteWorkGroups.rejected, error);
  }
});

export const { reducer: autocompleteWorkGroupsReducer } = autocompleteWorkGroups;
