import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMatchHistory } from 'interfaces/matchHistory';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'violationRecords';

const { Equals } = OdataComparator;

export const fetchViolationRecords = createAsyncThunk(
  `${name}/violationRecords`,
  async (id: string) => {
    const sortOrder = 'eventDateUtc asc';

    const params = new QueryBuilder()
      .orderBy(sortOrder)
      .filter(f => f.filterBy('oshaViolationId', Equals, id))
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IMatchHistory[]>>(
      '/api/oshaViolations/v3.01/oshaViolationMatchingHistory',
      {
        params
      }
    );

    return { data: data.value };
  },
  { condition: condition(name) }
);

type State = { matchRecords: IMatchHistory[] | null } & CommonState;

export const initialState: State = {
  matchRecords: null,
  isFetching: false,
  error: null
};

const violationMatchRecords = createSlice({
  name,
  initialState,
  reducers: {
    clearViolationMatchRecords: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchViolationRecords.pending, isFetching);
    builder.addCase(fetchViolationRecords.fulfilled, (state, action) => {
      state.isFetching = false;
      state.matchRecords = action.payload.data;
    });
    builder.addCase(fetchViolationRecords.rejected, (state, action) => {
      state.matchRecords = null;
      error(state, action);
    });
  }
});

export const { clearViolationMatchRecords } = violationMatchRecords.actions;
export const { reducer: violationMatchRecordsReducer } = violationMatchRecords;
