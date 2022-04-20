import axios from 'axios';
import { CommonState, condition } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { IAnswer } from 'interfaces/answer';
import { IAddScoreItem, IScoreItem } from 'interfaces/scoreItem';
import { IQuestionSection } from 'interfaces/questionSection';
import { IQuestion } from 'interfaces/question';
import { IScoreType } from 'interfaces/scoreType';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { sendError } from '@pec/aion-ui-core/sendError';
import { QuestionType } from 'interfaces/questionType';

const name = 'scoreItem';

export type FetchScoreItemParams = {
  scoreSetId: string;
  scoreItemId: string;
};

export const addScoreItem = createAsyncThunk(`${name}/addScoreItem`, async (scoreItem: IAddScoreItem, { dispatch }) => {
  try {
    const { data: scoreItemData } = await axios.post<IScoreItem>(
      `/api/scoringEngine/v3.1/scoreSets(${scoreItem.scoreSetId})/scoreItems`,
      scoreItem
    );

    dispatch(
      enqueueSnackbar({
        message: 'Score item was successfully created.',
        options: {
          variant: 'success'
        }
      })
    );
    return scoreItemData;
  } catch (error) {
    dispatch(enqueueRequestErrorSnackbar());
    throw error;
  }
});

export const updateScoreItem = createAsyncThunk(
  `${name}/updateScoreItem`,
  async (scoreItem: IScoreItem, { dispatch }) => {
    try {
      const { data: scoreItemData } = await axios.put<IScoreItem>(
        `/api/scoringEngine/v3.1/scoreSets(${scoreItem.scoreSetId})/scoreItems(${scoreItem.id})`,
        scoreItem
      );

      dispatch(
        enqueueSnackbar({
          message: 'Score item was successfully updated.',
          options: {
            variant: 'success'
          }
        })
      );
      return scoreItemData;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar());
      throw error;
    }
  }
);

export const fetchScoreItem = createAsyncThunk(
  `${name}/fetchScoreItem`,
  async ({ scoreSetId, scoreItemId }: FetchScoreItemParams) => {
    const response = await axios.get<OdataResponse<IScoreItem[]>>(
      `/api/scoringEngine/v3.1/scoreSets(${scoreSetId})/scoreItems`,
      {
        params: {
          $filter: `(id eq ${scoreItemId})`
        }
      }
    );

    return response.data;
  },
  { condition: condition(name) }
);

export const fetchScoreTypes = createAsyncThunk(
  `${name}/fetchScoreTypes`,
  async () => {
    const response = await axios.get<OdataResponse<IScoreType[]>>('/api/scoringEngine/v3.1/ScoreTypes', {
      params: { $orderby: 'order' }
    });
    return response.data;
  },
  { condition: condition(name) }
);

export const fetchQuestionSections = createAsyncThunk(
  `${name}/fetchQuestionSections`,
  async (clientId: string) => {
    const response = await axios.get<IQuestionSection[]>(
      `/api/scoringEngine/v3.1/organizations(${clientId})/QuestionSections`
    );
    return response.data;
  },
  { condition: condition(name) }
);

export const fetchQuestions = createAsyncThunk(
  `${name}/fetchQuestions`,
  async (questionSectionId: string) => {
    const response = await axios.get<OdataResponse<IQuestion[]>>('/api/scoringEngine/v3.1/Questions', {
      params: {
        $filter: `(questionSectionId eq ${questionSectionId}) and (questionType eq '${QuestionType.Checkbox}')`
      }
    });

    return response.data;
  },
  { condition: condition(name) }
);

export const fetchAnswers = createAsyncThunk(
  `${name}/fetchAnswers`,
  async (questionId: string) => {
    const response = await axios.get<OdataResponse<IAnswer[]>>('/api/scoringEngine/v3.1/CheckBoxChoices', {
      params: {
        $filter: `(questionId eq ${questionId})`
      }
    });

    return response.data;
  },
  { condition: condition(name) }
);

type State = {
  scoreItem: IScoreItem | null;
  isSubmitting: boolean;
  loadingCriteria: boolean;
  scoreTypes: IScoreType[] | null;
  questionSections: IQuestionSection[] | null;
  questions: IQuestion[] | null;
  answers: IAnswer[] | null;
} & CommonState;

export const initialState: State = {
  scoreItem: null,
  isFetching: false,
  isSubmitting: false,
  loadingCriteria: false,
  scoreTypes: null,
  questionSections: null,
  questions: null,
  answers: null,
  error: null
};

const scoreItem = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(addScoreItem.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateScoreItem.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(fetchScoreTypes.pending, state => {
      state.loadingCriteria = true;
    });
    builder.addCase(fetchScoreItem.pending, state => {
      state.scoreItem = null;
      state.error = null;
      state.isFetching = true;
    });
    builder.addCase(fetchQuestionSections.pending, state => {
      state.loadingCriteria = true;
    });
    builder.addCase(fetchQuestions.pending, state => {
      state.loadingCriteria = true;
      state.answers = null;
    });
    builder.addCase(fetchAnswers.pending, state => {
      state.loadingCriteria = true;
    });
    builder.addCase(fetchScoreItem.fulfilled, (state, action) => {
      state.scoreItem = action.payload.value[0];
      state.isFetching = false;
    });
    builder.addCase(addScoreItem.fulfilled, state => {
      state.isSubmitting = false;
      state.scoreItem = null;
    });
    builder.addCase(updateScoreItem.fulfilled, state => {
      state.isSubmitting = false;
    });
    builder.addCase(fetchScoreTypes.fulfilled, (state, action) => {
      state.loadingCriteria = false;
      state.scoreTypes = action.payload.value;
    });
    builder.addCase(fetchQuestionSections.fulfilled, (state, action) => {
      state.loadingCriteria = false;
      state.questionSections = action.payload;
    });
    builder.addCase(fetchQuestions.fulfilled, (state, action) => {
      state.loadingCriteria = false;
      state.questions = action.payload.value;
    });
    builder.addCase(fetchAnswers.fulfilled, (state, action) => {
      state.loadingCriteria = false;
      state.answers = action.payload.value;
    });
    builder.addCase(addScoreItem.rejected, (state, action) => {
      state.isSubmitting = false;
      sendError(action.error);
    });
    builder.addCase(updateScoreItem.rejected, (state, action) => {
      state.isSubmitting = false;
      sendError(action.error);
    });
  }
});

export const { reducer: scoreItemReducer } = scoreItem;
