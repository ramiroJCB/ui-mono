import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IForm } from 'interfaces/form';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';

const name = 'forms';

export const fetchForms = createAsyncThunk(
  `${name}/fetchForms`,
  async (organizationId: string) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder()
      .orderBy('name desc')
      .filter(f => f.filterBy('organizationId', Equals, organizationId))
      .toQueryParam();

    const { data } = await axios.get<{ value: IForm[]; '@odata.count': number }>('/api/inspections/v3.01/forms', {
      params
    });

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

export const formsAdapter = createEntityAdapter<IForm>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

export const formsSelectors = formsAdapter.getSelectors<RootState>(state => state.forms);

type State = { total: number } & CommonState;

export const initialState = formsAdapter.getInitialState<State>({
  isFetching: false,
  total: 0,
  error: null
});

const forms = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchForms.pending, isFetching);
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      formsAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(fetchForms.rejected, error);
  }
});

export const { reducer: formsReducer } = forms;
