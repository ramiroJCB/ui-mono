import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAnswer, IBaseAnswer } from 'interfaces/answer';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';
import { sendError } from '@pec/aion-ui-core/sendError';

const name = 'answers';

export type Params = {
  organizationId: string;
  sectionId: string;
};

export const fetchAnswers = createAsyncThunk(
  `${name}/fetchAnswers`,
  async ({ organizationId, sectionId }: Params) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder()
      .filter(f => f.filterBy('organizationId', Equals, organizationId).filterBy('sectionId', Equals, sectionId))
      .toQueryParam();

    const { data } = await axios.get<{ value: IAnswer[]; '@odata.count': number }>('/api/inspections/v3.01/answers', {
      params
    });

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

export const addAnswer = createAsyncThunk(`${name}/addAnswer`, async (answer: IBaseAnswer, { dispatch }) => {
  try {
    const { data } = await axios.post<IAnswer>('/api/inspections/v3.01/answers', answer);
    return data;
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar());
    throw error;
  }
});

export const updateAnswer = createAsyncThunk(`${name}/updateAnswer`, async (answer: IAnswer, { dispatch }) => {
  try {
    const { data } = await axios.patch<IAnswer>(`/api/inspections/v3.01/answers(${answer.id})`, [
      {
        op: 'replace',
        path: '/value',
        value: answer.value
      }
    ]);

    return data;
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar());
    throw error;
  }
});

export const answersAdapter = createEntityAdapter<IAnswer>();
export const answersAdapterSelectors = answersAdapter.getSelectors<RootState>(state => state.answers);

type State = { total: number; isSubmitting: boolean } & CommonState;

export const initialState = answersAdapter.getInitialState<State>({
  isFetching: false,
  isSubmitting: false,
  error: null,
  total: 0
});

const answers = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAnswers.pending, isFetching);
    builder.addCase(addAnswer.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateAnswer.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(fetchAnswers.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      answersAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(addAnswer.fulfilled, (state, action) => {
      state.isSubmitting = false;
      answersAdapter.addOne(state, action.payload);
    });
    builder.addCase(updateAnswer.fulfilled, (state, action) => {
      state.isSubmitting = false;
      answersAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
    });
    builder.addCase(fetchAnswers.rejected, error);
    builder.addCase(addAnswer.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;

      sendError(action.error);
    });
    builder.addCase(updateAnswer.rejected, (state, action) => {
      state.isSubmitting = false;
      state.error = action.error;

      sendError(action.error);
    });
  }
});

export const { reducer: answersReducer } = answers;
