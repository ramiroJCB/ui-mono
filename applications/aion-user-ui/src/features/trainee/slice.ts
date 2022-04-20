import axios from 'axios';
import { CommonState, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { IUserInfo } from '@pec/aion-ui-core/interfaces/userInfo';
import { RootState } from 'app/store';

const name = 'trainee';

export const fetchTrainee = createAsyncThunk<ITrainee | undefined, void>(
  `${name}/fetchTrainee`,
  async () => {
    const {
      data: { userId }
    } = await axios.get<IUserInfo>('/api/v2/userInfo');

    const response = await axios.get<{ value: ITrainee[] }>('/api/v3.01/trainees', {
      params: {
        $filter: `userId eq '${userId}'`
      }
    });

    const trainee = response.data.value[0];

    return trainee;
  },
  {
    condition: (_, { getState }: any) => {
      const { isFetching, trainee, error } = (getState() as RootState).trainee;
      return !isFetching && (!trainee || trainee === undefined) && !error;
    }
  }
);

export const updateTrainee = createAsyncThunk(`${name}/updateTrainee`, async (trainee: ITrainee) => {
  const response = await axios.put<ITrainee>(`/api/v3.01/trainees(${trainee.id})`, trainee);
  const updatedTrainee = response.data;

  return updatedTrainee;
});

type State = { trainee: ITrainee | null | undefined } & CommonState;

export const initialState: State = {
  isFetching: false,
  trainee: null,
  error: null
};

const trainee = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchTrainee.pending, isFetching);
    builder.addCase(updateTrainee.pending, isFetching);
    builder.addCase(fetchTrainee.fulfilled, (state, action) => {
      state.isFetching = false;
      state.trainee = action.payload;
      state.error = null;
    });
    builder.addCase(updateTrainee.fulfilled, (state, action) => {
      state.isFetching = false;
      state.trainee = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTrainee.rejected, error);
    builder.addCase(updateTrainee.rejected, error);
  }
});

export const { reducer: traineeReducer } = trainee;
