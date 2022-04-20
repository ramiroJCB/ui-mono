import axios from 'axios';
import { CommonState, isFetching, error } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IElement, IElementOption } from 'interfaces/element';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { RootState } from 'app/store';
import { sendError } from '@pec/aion-ui-core/sendError';
import { addElement, fetchElements } from '../formElements/slice';

const name = 'elementOptions';

export const addElementOption = createAsyncThunk(
  `${name}/addElementOption`,
  async (elementOption: Partial<IElementOption>, { dispatch }) => {
    try {
      const { data } = await axios.post<IElementOption>('/api/v3.01/formElementOptions', elementOption);
      return data;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar('Unable to add element option'));
      throw error;
    }
  }
);

export const updateElementOption = createAsyncThunk(
  `${name}/updateElementOption`,
  async ({ id, label }: IElementOption, { dispatch }) => {
    try {
      const { data } = await axios.patch<IElementOption>(`/api/v3.01/formElementOptions(${id})`, [
        {
          op: 'replace',
          path: '/label',
          value: label
        }
      ]);
      return data;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar('Unable to update element option'));
      throw error;
    }
  }
);

export const deleteElementOption = createAsyncThunk(`${name}/deleteElementOption`, async (id: string, { dispatch }) => {
  try {
    await axios.delete(`/api/v3.01/formElementOptions(${id})`);
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar('Unable to delete element option'));
    throw error;
  }
});

export const elementOptionsAdapter = createEntityAdapter<IElementOption>();
export const elementOptionsSelectors = elementOptionsAdapter.getSelectors<RootState>(state => state.elementOptions);

type State = { isSubmitting: boolean } & CommonState;

export const initialState = elementOptionsAdapter.getInitialState<State>({
  isFetching: false,
  isSubmitting: false,
  error: null
});

const elementOptions = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    // PENDING
    builder.addCase(addElementOption.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateElementOption.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(deleteElementOption.pending, isFetching);
    // FULFILLED
    builder.addCase(fetchElements.fulfilled, (state, action) => {
      const elements: IElement[] = action.payload.value;
      const elementOptions: IElementOption[] = [];
      elements.forEach(({ options }) => {
        if (options) {
          options.forEach(option => elementOptions.push(option));
        }
      });
      elementOptionsAdapter.setAll(state, elementOptions);
    });
    builder.addCase(addElement.fulfilled, (state, action) => {
      state.isSubmitting = false;
      const options = action.payload.options;
      if (options) {
        options.forEach(option => elementOptionsAdapter.addOne(state, option));
      }
    });
    builder.addCase(addElementOption.fulfilled, (state, action) => {
      state.isSubmitting = false;
      elementOptionsAdapter.addOne(state, action.payload);
    });
    builder.addCase(updateElementOption.fulfilled, (state, action) => {
      state.isSubmitting = false;
      elementOptionsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(deleteElementOption.fulfilled, (state, action) => {
      state.isFetching = false;
      elementOptionsAdapter.removeOne(state, action.meta.arg);
    });
    // REJECTED
    builder.addCase(addElementOption.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
    builder.addCase(updateElementOption.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
    builder.addCase(deleteElementOption.rejected, error);
  }
});

export const { reducer: elementOptionsReducer } = elementOptions;
