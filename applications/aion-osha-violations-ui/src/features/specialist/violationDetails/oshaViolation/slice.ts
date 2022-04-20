import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'oshaViolation';

const { Equals } = OdataComparator;

export const fetchOshaViolation = createAsyncThunk(
  `${name}/fetchOshaViolation`,
  async (id: string) => {
    const params = new QueryBuilder()
      .select(
        'id,citationId,violationType,activityNumber,importedDateUtc,naicsCode,openedDate,closedDate,oshaCompanyName,state,formattedAddress,associatedOrganizationViolationId'
      )
      .filter(f => f.filterBy('id', Equals, id))
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IOshaViolations[]>>('/api/oshaViolations/v3.01/oshaViolations', {
      params
    });

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { violation: IOshaViolations[] | null; total: number } & CommonState;

export const initialState: State = {
  violation: null,
  total: 0,
  isFetching: false,
  error: null
};

const oshaViolation = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchOshaViolation.pending, isFetching);
    builder.addCase(fetchOshaViolation.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violation = action.payload.data;
    });
    builder.addCase(fetchOshaViolation.rejected, (state, action) => {
      state.total = 0;
      state.violation = null;
      error(state, action);
    });
  }
});

export const { reducer: oshaViolationReducer } = oshaViolation;
