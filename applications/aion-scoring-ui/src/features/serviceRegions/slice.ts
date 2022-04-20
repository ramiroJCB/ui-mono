import axios from 'axios';
import { IServiceRegion } from 'interfaces/serviceRegion';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';
import { IScoreSet } from 'interfaces/scoreSet';

const name = 'serviceRegions';

export type FetchScoreSetsParams = {
  clientId: string;
  serviceRegionId: string;
};

export const fetchServiceRegions = createAsyncThunk(
  `${name}/fetchServiceRegions`,
  async (organizationId: string) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder().filter(f => f.filterBy('clientId', Equals, organizationId)).toQueryParam();
    const response = await axios.get<OdataResponse<IServiceRegion[]>>(`/api/v3.1/OrganizationServiceRegions`, {
      params
    });

    return response.data;
  },
  { condition: condition(name) }
);

export const fetchScoreSetsForServiceRegion = createAsyncThunk(
  `${name}/fetchScoreSetsForServiceRegion`,
  async ({ serviceRegionId, clientId }: FetchScoreSetsParams) => {
    const response = await axios.get<OdataResponse<IScoreSet[]>>(`/api/scoringEngine/v3.1/scoreSets`, {
      params: {
        $filter: `(serviceRegionId eq ${serviceRegionId} and organizationId eq ${clientId})`
      }
    });

    return { data: response.data, serviceRegionId };
  },
  { condition: condition(name) }
);

export const serviceRegionsAdapter = createEntityAdapter<IServiceRegion>();
export const serviceRegionsSelectors = serviceRegionsAdapter.getSelectors<RootState>(state => state.serviceRegions);

export const initialState = serviceRegionsAdapter.getInitialState<CommonState>({
  isFetching: false,
  error: null
});

const initialServiceRegionScoreSetState = {
  isFetching: false,
  error: null,
  scoreSets: null
};

const serviceRegions = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchServiceRegions.pending, isFetching);
    builder.addCase(fetchServiceRegions.fulfilled, (state, action) => {
      const serviceRegions = action.payload.value.map(serviceRegion => {
        return {
          ...serviceRegion,
          id: serviceRegion.serviceRegionId,
          scoreSetsState: initialServiceRegionScoreSetState
        };
      });
      state.isFetching = false;
      serviceRegionsAdapter.setAll(state, serviceRegions);
    });
    builder.addCase(fetchServiceRegions.rejected, error);
    builder.addCase(fetchScoreSetsForServiceRegion.pending, (state, action) => {
      const serviceRegion = { ...state.entities[action.meta.arg.serviceRegionId] };
      const updatedServiceRegion = {
        ...serviceRegion,
        scoreSetsState: { isFetching: true, error: null, scoreSets: null }
      };
      serviceRegionsAdapter.updateOne(state, {
        id: action.meta.arg.serviceRegionId,
        changes: updatedServiceRegion
      });
    });
    builder.addCase(fetchScoreSetsForServiceRegion.fulfilled, (state, action) => {
      const serviceRegion = { ...state.entities[action.meta.arg.serviceRegionId] };
      const updatedServiceRegion = {
        ...serviceRegion,
        scoreSetsState: {
          isFetching: false,
          error: null,
          scoreSets: action.payload.data.value.sort((a, b) => a.name.localeCompare(b.name))
        }
      };
      serviceRegionsAdapter.updateOne(state, {
        id: action.meta.arg.serviceRegionId,
        changes: updatedServiceRegion
      });
    });
    builder.addCase(fetchScoreSetsForServiceRegion.rejected, (state, action) => {
      const serviceRegion = { ...state.entities[action.meta.arg.serviceRegionId] };
      const updatedServiceRegion = {
        ...serviceRegion,
        scoreSetsState: { isFetching: false, error: action.error, scoreSets: null }
      };
      serviceRegionsAdapter.updateOne(state, {
        id: action.meta.arg.serviceRegionId,
        changes: updatedServiceRegion
      });
    });
  }
});

export const { reducer: serviceRegionsReducer } = serviceRegions;
