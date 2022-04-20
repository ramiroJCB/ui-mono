import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'unassociatedViolations';

const { Equals, NotEquals } = OdataComparator;

export const fetchUnassociatedViolations = createAsyncThunk(
  `${name}/fetchUnassociatedViolations`,
  async ({ page, state, activity, naics, keyword, status, matchType, orderBy, order, pageSize }: ParsedUrlQuery) => {
    const top = pageSize ? Number(pageSize) : 10;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;
    if (!isNaN(Number(keyword))) return { data: [], total: 0 };

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

const unassociatedViolations = createSlice({
  name,
  initialState,
  reducers: {
    clearUnassociatedSearch: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchUnassociatedViolations.pending, isFetching);
    builder.addCase(fetchUnassociatedViolations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violations = action.payload.data;
    });
    builder.addCase(fetchUnassociatedViolations.rejected, (state, action) => {
      state.total = 0;
      state.violations = null;
      error(state, action);
    });
  }
});
export const { clearUnassociatedSearch } = unassociatedViolations.actions;
export const { reducer: unassociatedViolationsReducer } = unassociatedViolations;
