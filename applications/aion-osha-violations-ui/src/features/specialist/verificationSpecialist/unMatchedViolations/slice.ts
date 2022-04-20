import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'unMatchedViolations';

const { Equals, NotEquals } = OdataComparator;

export const fetchUnMatchedViolations = createAsyncThunk(
  `${name}/fetchUnMatchedViolations`,
  async ({ page, state, activity, naics, keyword, matchType, orderBy, order, pageSize, status }: ParsedUrlQuery) => {
    const top = pageSize ? Number(pageSize) : 10;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    const params = new QueryBuilder()
      .top(top)
      .skipByPage(page ? page.toString() : '1', top)
      .orderBy(sortOrder)
      .select(
        'id,citationId,violationType,activityNumber,importedDateUtc,naicsCode,openedDate,closedDate,oshaCompanyName,matchType,state,status'
      )
      .filter(f =>
        f
          .filterBy('state', Equals, state)
          .filterBy('naicsCode', Equals, naics && naics)
          .filterBy('activityNumber', Equals, activity && Number(activity))
          .filterBy('matchType', NotEquals, matchType)
          .filterBy('status', Equals, status)
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

const unMatchedViolations = createSlice({
  name,
  initialState,
  reducers: {
    clearUnMatchedSearch: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchUnMatchedViolations.pending, isFetching);
    builder.addCase(fetchUnMatchedViolations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violations = action.payload.data;
    });

    builder.addCase(fetchUnMatchedViolations.rejected, (state, action) => {
      state.total = 0;
      state.violations = null;
      error(state, action);
    });
  }
});
export const { clearUnMatchedSearch } = unMatchedViolations.actions;
export const { reducer: unMatchedViolationsReducer } = unMatchedViolations;
