import axios from 'axios';
import { createAsyncThunk, createEntityAdapter, createSlice, SerializedError } from '@reduxjs/toolkit';
import { error, isFetching } from '@pec/aion-ui-core/slices/common';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { OdataComparator } from '@pec/aion-ui-odata/types/odataComparator';
import { ParsedUrlQuery } from 'querystring';
import { QueryBuilder } from '@pec/aion-ui-odata/builders/odataQueryBuilder';
import { RootState } from 'combineReducers';

const name = 'assignedEmployeeReport';

type Params = {
  organizationId: string;
  urlQuery: ParsedUrlQuery;
};

export const filterAssignedEmployeeReport = ({
  organizationId,
  urlQuery: { employees, contractors, workGroups, jobTypes, trainings, status }
}: Params) =>
  new QueryBuilder().filter(({ filterBy }) => {
    const { Equals, In } = OdataComparator;
    let baseFilter = filterBy('organizationId', Equals, organizationId).filterBy('isDeleted', Equals, false);
    const filters = [
      { filterBy: 'employeeId', value: employees },
      { filterBy: 'contractorId', value: contractors },
      { filterBy: 'workGroupId', value: workGroups },
      { filterBy: 'jobTypeId', value: jobTypes },
      { filterBy: 'trainingRequirementId', value: trainings }
    ];

    filters.forEach(({ filterBy, value }) => {
      if (value && !Array.isArray(value)) {
        baseFilter = baseFilter.filterBy(filterBy, In, value.split(','));
      }
    });

    if (status) {
      baseFilter = baseFilter.filterBy('isCompliant', Equals, status === 'Compliant');
    }

    return baseFilter;
  });

export const fetchAssignedEmployeeReport = createAsyncThunk(
  `${name}/fetchAssignedEmployeeReport`,
  async (params: Params) => {
    const top = 100;

    const odataParams = filterAssignedEmployeeReport(params)
      .top(top)
      .skipByPage(params.urlQuery.page || '1', top)
      .toQueryParam();

    const { data } = await axios.get<{ value: IWorkGroupJobTypeEmployeeTraining[]; '@odata.count': number }>(
      '/api/trainingCompliance/v3.01/workGroupJobTypeEmployeeJobTypeTrainingRequirements',
      { params: odataParams }
    );

    return { data: data.value, total: data['@odata.count'] };
  }
);

export const assignedEmployeeReportAdapter = createEntityAdapter<IWorkGroupJobTypeEmployeeTraining>({
  selectId: ({ workGroupJobTypeEmployeeId, trainingRequirementId }) =>
    `${workGroupJobTypeEmployeeId}${trainingRequirementId}`
});
export const assignedEmployeeReportSelectors = assignedEmployeeReportAdapter.getSelectors<RootState>(
  state => state.assignedEmployeeReport
);

export type State = {
  isFetching: boolean;
  total: number;
  error: SerializedError | null;
};

export const initialState = assignedEmployeeReportAdapter.getInitialState<State>({
  isFetching: false,
  error: null,
  total: 0
});

const assignedEmployeeReport = createSlice({
  name,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchAssignedEmployeeReport.pending, isFetching);
    builder.addCase(fetchAssignedEmployeeReport.fulfilled, (state, action) => {
      state.isFetching = false;
      state.total = action.payload.total;
      assignedEmployeeReportAdapter.setAll(state, action.payload.data);
    });
    builder.addCase(fetchAssignedEmployeeReport.rejected, error);
  }
});

export const { reducer: assignedEmployeeReportReducer } = assignedEmployeeReport;
