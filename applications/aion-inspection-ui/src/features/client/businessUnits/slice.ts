import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { IBusinessUnit } from 'interfaces/businessUnit';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';

const name = 'businessUnits';

type Params = {
  clientId: string;
  contractorId: string;
};

export const fetchBusinessUnits = createAsyncThunk(
  `${name}/fetchBusinessUnits`,
  async ({ clientId, contractorId }: Params) => {
    const { Equals } = OdataComparator;
    const params = new QueryBuilder()
      .orderBy('businessUnitName desc')
      .filter(f => f.filterBy('clientId', Equals, clientId).filterBy('contractorId', Equals, contractorId))
      .toQueryParam();

    const { data } = await axios.get<{ value: IBusinessUnit[]; '@odata.count': number }>('/api/v3.01/businessUnits', {
      params
    });

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

export const businessUnitsAdapter = createEntityAdapter<IBusinessUnit>({
  sortComparer: (a, b) => a.businessUnitName.localeCompare(b.businessUnitName)
});

export const businessUnitsSelectors = businessUnitsAdapter.getSelectors<RootState>(state => state.businessUnits);

type State = { hasFetched: boolean; total: number } & CommonState;

export const initialState = businessUnitsAdapter.getInitialState<State>({
  hasFetched: false,
  isFetching: false,
  total: 0,
  error: null
});

const businessUnits = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchBusinessUnits.pending, isFetching);
    builder.addCase(fetchBusinessUnits.fulfilled, (state, action) => {
      state.hasFetched = true;
      state.isFetching = false;
      state.total = action.payload.total;
      businessUnitsAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(fetchBusinessUnits.rejected, error);
  }
});

export const { reducer: businessUnitsReducer } = businessUnits;
