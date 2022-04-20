import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'pendingViolations';

const { Equals, NotEquals } = OdataComparator;

export const fetchPendingViolations = createAsyncThunk(
  `${name}/fetchPendingViolations`,
  async ({ page, state, activity, naics, keyword, status, matchType, orderBy, order, pageSize }: ParsedUrlQuery) => {
    const top = pageSize ? Number(pageSize) : 10;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    const params = new QueryBuilder()
      .top(top)
      .skipByPage(page ? page.toString() : '1', top)
      .orderBy(sortOrder)
      .select(
        'id,citationId,violationType,activityNumber,importedDateUtc,naicsCode,openedDate,closedDate,matchType,oshaCompanyName,state,status'
      )
      .filter(f =>
        f
          .filterBy('state', Equals, state)
          .filterBy('status', Equals, status)
          .filterBy('oshaNaicsCode', Equals, naics && naics)
          .filterBy('matchType', NotEquals, matchType)
          .filterBy('activityNumber', Equals, activity && Number(activity))
      )
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IOshaViolations[]>>('/api/oshaViolations/v3.01/oshaViolations', {
      params: {
        companyNameFilter: keyword,
        ...params
      }
    });

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

type State = { violations: IOshaViolations[] | null; total: number } & CommonState;

export const initialState: State = {
  violations: null,
  total: 0,
  isFetching: false,
  error: null
};

const pendingViolations = createSlice({
  name,
  initialState,
  reducers: {
    clearPendingSearch: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchPendingViolations.pending, isFetching);
    builder.addCase(fetchPendingViolations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violations = action.payload.data;
    });
    builder.addCase(fetchPendingViolations.rejected, (state, action) => {
      state.total = 0;
      state.violations = null;
      error(state, action);
    });
  }
});
export const { clearPendingSearch } = pendingViolations.actions;
export const { reducer: pendingViolationsReducer } = pendingViolations;
