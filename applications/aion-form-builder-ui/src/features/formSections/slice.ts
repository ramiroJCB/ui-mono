import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ISection } from 'interfaces/section';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';
import { sendError } from '@pec/aion-ui-core/sendError';

const name = 'sections';
type ResponseData = { value: ISection[]; '@odata.count': number };

export const fetchSections = createAsyncThunk(
  `${name}/fetchSections`,
  async (formId: string) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder().filter(f => f.filterBy('formId', Equals, formId)).toQueryParam();
    const response = await axios.get<ResponseData>('/api/v3.01/formSections', { params });

    return response.data;
  },
  { condition: condition(name) }
);

export const addSection = createAsyncThunk(`${name}/addSection`, async (section: Partial<ISection>, { dispatch }) => {
  try {
    const { data } = await axios.post<ISection>(`/api/v3.01/formSections`, section);
    return data;
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar());
    throw error;
  }
});

export const updateSection = createAsyncThunk(
  `${name}/updateSection`,
  async (section: Partial<ISection>, { dispatch }) => {
    try {
      const { data } = await axios.put<ISection>(`/api/v3.01/formSections(${section.id})`, section);
      return data;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar());
      throw error;
    }
  }
);

export const sectionsAdapter = createEntityAdapter<ISection>();
export const sectionsSelectors = sectionsAdapter.getSelectors<RootState>(state => state.sections);

type State = { isSubmitting: boolean } & CommonState;

export const initialState = sectionsAdapter.getInitialState<State>({
  isFetching: false,
  isSubmitting: false,
  error: null
});

const sections = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchSections.pending, isFetching);
    builder.addCase(addSection.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateSection.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(fetchSections.fulfilled, (state, action) => {
      state.isFetching = false;
      sectionsAdapter.setAll(state, action.payload.value);
    });
    builder.addCase(addSection.fulfilled, (state, action) => {
      state.isSubmitting = false;
      sectionsAdapter.addOne(state, action.payload);
    });
    builder.addCase(updateSection.fulfilled, (state, action) => {
      state.isSubmitting = false;
      sectionsAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(fetchSections.rejected, error);
    builder.addCase(addSection.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
    builder.addCase(updateSection.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;
      sendError(action.error);
    });
  }
});

export const { reducer: sectionsReducer } = sections;
