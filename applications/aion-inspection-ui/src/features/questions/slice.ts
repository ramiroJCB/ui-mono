import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { ISection, Question } from 'interfaces/section';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';

const name = 'questions';

export type Params = {
  organizationId: string;
  sectionId: string;
};

export const fetchQuestions = createAsyncThunk(
  `${name}/fetchQuestions`,
  async ({ organizationId, sectionId }: Params, { rejectWithValue, dispatch }) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder()
      .filter(f => f.filterBy('organizationId', Equals, organizationId).filterBy('id', Equals, sectionId))
      .toQueryParam();

    const { data } = await axios.get<{ value: ISection[]; '@odata.count': number }>('/api/inspections/v3.01/sections', {
      params
    });

    if (data.value.length) {
      return { data: data.value[0], total: data['@odata.count.count'] };
    } else {
      dispatch(enqueueRequestErrorSnackbar());
      return rejectWithValue('Question not found');
    }
  },
  { condition: condition(name) }
);

export const questionsAdapter = createEntityAdapter<Question>();
export const questionsAdapterSelectors = questionsAdapter.getSelectors<RootState>(state => state.questions);

type State = { section: ISection | null; total: number } & CommonState;

export const initialState = questionsAdapter.getInitialState<State>({
  isFetching: false,
  section: null,
  error: null,
  total: 0
});

const questions = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchQuestions.pending, isFetching);
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      state.isFetching = false;
      state.section = action.payload.data;
      state.total = action.payload.total;
      questionsAdapter.setAll(state, action.payload.data.schema);
    });
    builder.addCase(fetchQuestions.rejected, error);
  }
});

export const { reducer: questionsReducer } = questions;
