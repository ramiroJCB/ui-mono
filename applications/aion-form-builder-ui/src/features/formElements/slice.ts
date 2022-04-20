import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { DefaultElementProps, IElement } from 'interfaces/element';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';
import { sendError } from '@pec/aion-ui-core/sendError';

const name = 'elements';
type ResponseData = { value: IElement[]; '@odata.count': number };

export const fetchElements = createAsyncThunk(
  `${name}/fetchElements`,
  async (sectionId: string) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder().filter(f => f.filterBy('sectionId', Equals, sectionId)).toQueryParam();
    const response = await axios.get<ResponseData>('/api/v3.01/formElements', { params });

    return response.data;
  },
  { condition: condition(name) }
);

export const addElement = createAsyncThunk(`${name}/addElement`, async (element: DefaultElementProps, { dispatch }) => {
  try {
    const { data } = await axios.post<IElement>('/api/v3.01/formElements', element);
    return data;
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar('Unable to add element'));
    throw error;
  }
});

export const updateElement = createAsyncThunk(
  `${name}/updateElement`,
  async (element: Partial<IElement>, { dispatch }) => {
    try {
      const { data } = await axios.put<IElement>(`/api/v3.01/formElements(${element.id})`, element);
      return data;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar());
      throw error;
    }
  }
);

export const updateElementSortOrder = createAsyncThunk(
  `${name}/updateElementOrder`,
  async ({ id, sortOrder }: Partial<IElement>, { dispatch }) => {
    try {
      const { data } = await axios.patch<IElement>(`/api/v3.01/formElements(${id})`, [
        {
          op: 'replace',
          path: '/sortOrder',
          value: sortOrder,
          headers: {
            'X-Aion-FormElement-Order': [{ id, sortOrder }]
          }
        }
      ]);
      return data;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar('Unable to update sort order'));
      throw error;
    }
  }
);

export const updateElementSectionId = createAsyncThunk(
  `${name}/updateElementSectionId`,
  async ({ id, sectionId }: Partial<IElement>, { dispatch }) => {
    try {
      const { data } = await axios.patch<IElement>(`/api/v3.01/formElements(${id})`, [
        {
          op: 'replace',
          path: '/sectionId',
          value: sectionId
        }
      ]);
      return data;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar('Unable to move element to new section'));
      throw error;
    }
  }
);

export const deleteElement = createAsyncThunk(`${name}/deleteElement`, async (id: string, { dispatch }) => {
  try {
    const { data } = await axios.delete(`/api/v3.01/formElements(${id})`);
    return data;
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar('Unable to delete element'));
    throw error;
  }
});

export const elementsAdapter = createEntityAdapter<IElement>();
export const elementsSelectors = elementsAdapter.getSelectors<RootState>(state => state.elements);

type State = { isSubmitting: boolean } & CommonState;

export const initialState = elementsAdapter.getInitialState<State>({
  isFetching: false,
  isSubmitting: false,
  error: null
});

const elements = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    // PENDING
    builder.addCase(fetchElements.pending, isFetching);
    builder.addCase(addElement.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateElement.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateElementSortOrder.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateElementSectionId.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(deleteElement.pending, isFetching);
    // FULFILLED
    builder.addCase(fetchElements.fulfilled, (state, action) => {
      state.isFetching = false;
      elementsAdapter.setAll(state, action.payload.value);
    });
    builder.addCase(addElement.fulfilled, (state, action) => {
      state.isSubmitting = false;
      elementsAdapter.addOne(state, action.payload);
    });
    builder.addCase(updateElement.fulfilled, (state, action) => {
      state.isSubmitting = false;
      elementsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(updateElementSortOrder.fulfilled, (state, action) => {
      state.isSubmitting = false;
      elementsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(updateElementSectionId.fulfilled, (state, action) => {
      state.isSubmitting = false;
      elementsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(deleteElement.fulfilled, (state, action) => {
      state.isFetching = false;
      elementsAdapter.removeOne(state, action.payload.id);
    });
    // REJECTED
    builder.addCase(fetchElements.rejected, error);
    builder.addCase(addElement.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
    builder.addCase(updateElementSortOrder.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
    builder.addCase(updateElementSectionId.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
    builder.addCase(deleteElement.rejected, error);
  }
});

export const { reducer: elementsReducer } = elements;
