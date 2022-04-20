import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { OdataResponse } from '@pec/aion-ui-odata/types/odataResponse';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';

const name = 'associatedViolations';

const { Equals, Contains, NotEquals } = OdataComparator;

export const fetchAssociatedViolations = createAsyncThunk(
  `${name}/fetchAssociatedViolations`,
  async ({ page, state, activity, naics, keyword, status, matchType, orderBy, order, pageSize }: ParsedUrlQuery) => {
    const top = pageSize ? Number(pageSize) : 10;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : undefined;

    const params = new QueryBuilder()
      .top(top)
      .skipByPage(page ? page.toString() : '1', top)
      .orderBy(sortOrder)
      .select(
        'id,citationId,violationType,activityNumber,importedDateUtc,naicsCode,openedDate,matchType,closedDate,oshaCompanyName,state,status,associatedCompanyName,associatedCompanyNumber,associatedMatchPercentage'
      )
      .filter(f =>
        f
          .filterBy('state', Equals, state)
          .filterBy('status', Equals, status)
          .filterBy('oshaNaicsCode', Equals, naics && naics)
          .filterBy('matchType', NotEquals, matchType)
          .filterBy('activityNumber', Equals, activity && Number(activity))
          .filterBy('associatedCompanyName', Contains, keyword)
          .or(f => f.filterBy('associatedCompanyNumber', Equals, keyword))
      )
      .toQueryParam();

    const { data } = await axios.get<OdataResponse<IOshaViolations[]>>('/api/oshaViolations/v3.01/oshaViolations', {
      params
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

const associatedViolations = createSlice({
  name,
  initialState,
  reducers: {
    clearAssociatedSearch: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(fetchAssociatedViolations.pending, isFetching);
    builder.addCase(fetchAssociatedViolations.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      state.violations = action.payload.data;
    });
    builder.addCase(fetchAssociatedViolations.rejected, (state, action) => {
      state.total = 0;
      state.violations = null;
      error(state, action);
    });
  }
});
export const { clearAssociatedSearch } = associatedViolations.actions;
export const { reducer: associatedViolationsReducer } = associatedViolations;
