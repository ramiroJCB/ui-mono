import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IInspection } from 'interfaces/inspection';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'inspection';

export const fetchInspection = createAsyncThunk(
  `${name}/fetchInspection`,
  async (inspectionId: string) => {
    const { Equals } = OdataComparator;

    const params = new QueryBuilder().filter(f => f.filterBy('id', Equals, inspectionId)).toQueryParam();

    const { data } = await axios.get<IInspection>(`/api/inspections/v3.01/inspections(${inspectionId})`, {
      params
    });

    return data;
  },
  { condition: condition(name) }
);

type State = { inspection: IInspection | null } & CommonState;

export const initialState: State = {
  inspection: null,
  isFetching: false,
  error: null
};

const inspection = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchInspection.pending, isFetching);
    builder.addCase(fetchInspection.fulfilled, (state, action) => {
      state.isFetching = false;
      state.inspection = action.payload;
    });
    builder.addCase(fetchInspection.rejected, error);
  }
});

export const { reducer: inspectionReducer } = inspection;
