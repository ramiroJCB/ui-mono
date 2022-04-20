import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAddForm, IForm } from 'interfaces/form';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';
import { sendError } from '@pec/aion-ui-core/sendError';

const name = 'forms';

type Params = {
  organizationId: string;
};

type ResponseData = { value: IForm[]; '@odata.count': number };

export const fetchForms = createAsyncThunk(
  `${name}/fetchForms`,
  async ({ organizationId }: Params) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder()
      .orderBy('name asc')
      .filter(f => f.filterBy('organizationId', Equals, organizationId))
      .toQueryParam();
    const response = await axios.get<ResponseData>('/api/v3.01/forms', { params });

    return response.data;
  },
  { condition: condition(name) }
);

export const addForm = createAsyncThunk(`${name}/addForm`, async (form: IAddForm, { dispatch }) => {
  try {
    const { data } = await axios.post<IForm>('/api/v3.01/forms', form);
    return data;
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar());
    throw error;
  }
});

export const formsAdapter = createEntityAdapter<IForm>();
export const formsSelectors = formsAdapter.getSelectors<RootState>(state => state.forms);

type State = { isSubmitting: boolean } & CommonState;

export const initialState = formsAdapter.getInitialState<State>({
  isFetching: false,
  isSubmitting: false,
  error: null
});

const forms = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchForms.pending, isFetching);
    builder.addCase(addForm.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.isFetching = false;
      formsAdapter.setAll(state, action.payload.value);
    });
    builder.addCase(addForm.fulfilled, (state, action) => {
      state.isSubmitting = false;
      formsAdapter.addOne(state, action.payload);
    });
    builder.addCase(fetchForms.rejected, error);
    builder.addCase(addForm.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
  }
});

export const { reducer: formsReducer } = forms;
