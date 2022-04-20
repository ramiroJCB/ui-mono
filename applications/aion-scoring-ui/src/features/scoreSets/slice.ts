import axios, { AxiosResponse } from 'axios';
import { CommonState, condition, error } from 'common/slice';
import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { FetchScoreSetsParams } from 'features/serviceRegions/slice';
import { IScoreSet, IAddScoreSet } from 'interfaces/scoreSet';
import { IServiceRegionService } from 'interfaces/serviceRegionService';
import { IScoreSetService, IServiceListItem } from 'interfaces/scoreSetService';
import { IScoreItem } from 'interfaces/scoreItem';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { sendError } from '@pec/aion-ui-core/sendError';

const name = 'scoreSet';

type AddScoreSetParams = {
  scoreSet: IAddScoreSet;
  scoreSetServices: IServiceListItem[];
};

type UpdateScoreSetParams = {
  scoreSet: IScoreSet;
  scoreSetServices: IServiceListItem[];
};

export const fetchScoreSet = createAsyncThunk(
  `${name}/fetchScoreSet`,
  async (scoreSetId: string) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder().filter(f => f.filterBy('id', Equals, scoreSetId)).toQueryParam();

    const [scoreSetResponse, scoreSetServicesResponse] = (await axios.all([
      axios.get('/api/scoringEngine/v3.1/scoreSets', { params }),
      axios.get(`/api/scoringEngine/v3.1/scoreSets(${scoreSetId})/services`)
    ])) as [AxiosResponse<OdataResponse<IScoreSet>>, AxiosResponse<OdataResponse<IScoreSetService[]>>];

    return { scoreSetData: scoreSetResponse.data, scoreSetServicesData: scoreSetServicesResponse.data };
  },
  { condition: condition(name) }
);

export const fetchExistingScoreSets = createAsyncThunk(
  `${name}/fetchExistingScoreSets`,
  async ({ serviceRegionId, clientId }: FetchScoreSetsParams) => {
    const response = await axios.get<OdataResponse<IScoreSet[]>>(`/api/scoringEngine/v3.1/scoreSets`, {
      params: {
        $filter: `(serviceRegionId eq ${serviceRegionId} and organizationId eq ${clientId})`
      }
    });

    return response.data;
  },
  { condition: condition(name) }
);

export const fetchExistingScoreItems = createAsyncThunk(
  `${name}/fetchExistingScoreItems`,
  async (scoreSetId: string) => {
    const response = await axios.get<OdataResponse<IScoreItem[]>>(
      `/api/scoringEngine/v3.1/scoreSets(${scoreSetId})/scoreItems`,
      { params: { $orderby: 'name' } }
    );

    return response.data;
  },
  { condition: condition(name) }
);

export const fetchServiceRegionServices = createAsyncThunk(
  `${name}/fetchServiceRegionServices`,
  async (serviceRegionId: string) => {
    const response = await axios.get<OdataResponse<IServiceRegionService[]>>(`/api/v3.1/serviceRegionServices`, {
      params: {
        $filter: `serviceRegionId eq ${serviceRegionId}`,
        $orderBy: 'serviceName'
      }
    });

    return response.data;
  },
  { condition: condition(name) }
);

export const addScoreSet = createAsyncThunk(
  `${name}/addScoreSet`,
  async ({ scoreSet, scoreSetServices }: AddScoreSetParams, { dispatch }) => {
    try {
      const { data: scoreSetData } = await axios.post<IScoreSet>('/api/scoringEngine/v3.1/scoreSets', scoreSet);

      scoreSetServices.length > 0 &&
        (await axios.put(`/api/scoringEngine/v3.1/scoreSets(${scoreSetData.id})/services`, scoreSetServices));

      dispatch(
        enqueueSnackbar({
          message: 'Score set was successfully created.',
          options: {
            variant: 'success'
          }
        })
      );
      return scoreSetData;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar());
      throw error;
    }
  }
);

export const updateScoreSet = createAsyncThunk(
  `${name}/updateScoreSet`,
  async ({ scoreSet, scoreSetServices }: UpdateScoreSetParams, { dispatch }) => {
    try {
      const [response] = await axios.all([
        axios.put(`/api/scoringEngine/v3.1/scoreSets(${scoreSet.id})`, scoreSet),
        axios.put(`/api/scoringEngine/v3.1/scoreSets(${scoreSet.id})/services`, scoreSetServices)
      ]);
      dispatch(
        enqueueSnackbar({
          message: 'Score set was successfully updated.',
          options: {
            variant: 'success'
          }
        })
      );
      return response;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar());
      throw error;
    }
  }
);

export const setExistingScoreSets = createAction(`${name}/setExistingScoreSets`, (scoreSets: IScoreSet[] | null) => {
  return { payload: { value: scoreSets } };
});

type State = {
  scoreSet: IScoreSet | null;
  scoreSets: IScoreSet[] | null;
  serviceRegionServices: IServiceRegionService[] | null;
  scoreItems: IScoreItem[] | null;
  scoreSetServices: IScoreSetService[] | null;
  isSubmitting: boolean;
} & CommonState;

export const initialState: State = {
  scoreSet: null,
  scoreSets: null,
  serviceRegionServices: null,
  scoreItems: null,
  scoreSetServices: null,
  isFetching: false,
  isSubmitting: false,
  error: null
};

const scoreSet = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(setExistingScoreSets, (state, action) => {
      state.scoreSets = action.payload.value;
    });
    builder.addCase(fetchScoreSet.pending, state => {
      state.scoreSet = null;
      state.error = null;
      state.isFetching = true;
    });
    builder.addCase(addScoreSet.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(updateScoreSet.pending, state => {
      state.isSubmitting = true;
      state.error = null;
    });
    builder.addCase(fetchScoreSet.fulfilled, (state, action) => {
      const { scoreSetData, scoreSetServicesData } = action.payload;
      state.isFetching = false;
      state.scoreSet = scoreSetData.value[0];
      state.scoreSetServices = scoreSetServicesData.value;
    });
    builder.addCase(fetchExistingScoreSets.fulfilled, (state, action) => {
      state.scoreSets = action.payload.value;
    });
    builder.addCase(fetchExistingScoreItems.fulfilled, (state, action) => {
      state.scoreItems = action.payload.value;
    });
    builder.addCase(fetchServiceRegionServices.fulfilled, (state, action) => {
      state.serviceRegionServices = action.payload.value;
    });
    builder.addCase(addScoreSet.fulfilled, state => {
      state.isSubmitting = false;
      state.scoreSet = null;
    });
    builder.addCase(updateScoreSet.fulfilled, state => {
      state.isSubmitting = false;
      state.error = null;
    });
    builder.addCase(fetchScoreSet.rejected, error);
    builder.addCase(addScoreSet.rejected, (state, action) => {
      state.isSubmitting = false;
      sendError(action.error);
    });
    builder.addCase(updateScoreSet.rejected, (state, action) => {
      state.isSubmitting = false;
      sendError(action.error);
    });
  }
});

export const { reducer: scoreSetReducer } = scoreSet;
