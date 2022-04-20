import axios from 'axios';
import { CommonState, condition, error, isFetching } from 'common/slice';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { CurrentStatus, IInspection, IInspectionForm } from 'interfaces/inspection';
import { enqueueRequestErrorSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'app/store';

const name = 'inspections';

export type Params = {
  organizationId: string;
  urlQuery: ParsedUrlQuery;
  pageSize: number;
  isClientOrg?: boolean;
};

export const fetchInspections = createAsyncThunk(
  `${name}/fetchInspections`,
  async ({ organizationId, urlQuery: { order, orderBy, page }, pageSize, isClientOrg }: Params) => {
    const top = pageSize;
    const sortOrder = orderBy && order ? `${orderBy} ${order}` : `status asc, dateOfInspectionUtc desc`;
    const { Equals } = OdataComparator;

    const params = new QueryBuilder()
      .top(top)
      .orderBy(sortOrder)
      .skipByPage(page || '1', top)
      .filter(f =>
        isClientOrg
          ? f.filterBy('organizationId', Equals, organizationId)
          : f.filterBy('contractorId', Equals, organizationId).filterBy('status', Equals, CurrentStatus.Submitted)
      )
      .toQueryParam();

    const { data } = await axios.get<{ value: IInspection[]; '@odata.count': number }>(
      '/api/inspections/v3.01/inspections',
      {
        params
      }
    );

    return { data: data.value, total: data['@odata.count'] };
  },
  { condition: condition(name) }
);

export const addInspection = createAsyncThunk(
  `${name}/addInspections`,
  async (values: IInspectionForm, { dispatch }) => {
    try {
      const { data } = await axios.post<IInspection>('/api/inspections/v3.01/inspections', values);
      return data;
    } catch (error) {
      dispatch(enqueueRequestErrorSnackbar());
      throw error;
    }
  }
);

export const inspectionsAdapter = createEntityAdapter<IInspection>();
export const inspectionsSelectors = inspectionsAdapter.getSelectors<RootState>(state => state.inspections);

type State = { total: number } & CommonState;

export const initialState = inspectionsAdapter.getInitialState<State>({
  isFetching: false,
  error: null,
  total: 0
});

const inspections = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchInspections.pending, isFetching);
    builder.addCase(addInspection.pending, isFetching);
    builder.addCase(fetchInspections.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      inspectionsAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(addInspection.fulfilled, (state, action) => {
      state.isFetching = false;
      inspectionsAdapter.addOne(state, action.payload);
    });
    builder.addCase(fetchInspections.rejected, error);
    builder.addCase(addInspection.rejected, error);
  }
});

export const { reducer: inspectionsReducer } = inspections;
