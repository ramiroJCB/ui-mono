import axios from 'axios';
import { CommonState, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { ITraineeCourseCredit } from 'interfaces/traineeCourseCredit';
import { IUserInfo } from '@pec/aion-ui-core/interfaces/userInfo';
import { RootState } from 'app/store';

const name = 'traineeCourseCredits';

export const fetchTraineeCourseCredits = createAsyncThunk<ITraineeCourseCredit[], void>(
  `${name}/fetchTraineeCourseCredits`,
  async () => {
    const {
      data: { userId }
    } = await axios.get<IUserInfo>('/api/v2/userInfo');

    const response = await axios.get<{ value: ITraineeCourseCredit[] }>('/api/v3.01/traineeCourseCredits', {
      params: {
        $filter: `userId eq '${userId}' and passed eq true`
      }
    });

    return response.data.value;
  },
  {
    condition: (_, { getState }: any) => {
      const traineeCourseCreditsTotal = traineeCourseCreditsSelectors.selectTotal(getState());
      const { isFetching } = (getState() as RootState).traineeCourseCredits;

      return !isFetching && traineeCourseCreditsTotal === 0;
    }
  }
);

export const traineeCourseCreditsAdapter = createEntityAdapter<ITraineeCourseCredit>({
  selectId: ({ trainingCourseId, completionDate }) => trainingCourseId + completionDate,
  sortComparer: (a, b) =>
    `${a.courseExpired} ${a.courseName} ${b.completionDate}`.localeCompare(
      `${b.courseExpired} ${b.courseName} ${a.completionDate}`
    )
});
export const traineeCourseCreditsSelectors = traineeCourseCreditsAdapter.getSelectors<RootState>(
  state => state.traineeCourseCredits
);

export const initialState = traineeCourseCreditsAdapter.getInitialState<CommonState>({
  isFetching: false,
  error: null
});

const traineeCourseCredits = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTraineeCourseCredits.pending, isFetching);
    builder.addCase(fetchTraineeCourseCredits.fulfilled, (state, action) => {
      state.isFetching = false;
      traineeCourseCreditsAdapter.setAll(state, action.payload);
      state.error = null;
    });
    builder.addCase(fetchTraineeCourseCredits.rejected, error);
  }
});

export const { reducer: traineeCourseCreditsReducer } = traineeCourseCredits;
