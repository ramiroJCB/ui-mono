import { Actions } from 'actions/fetchEmployeeJobTraining';
import { AxiosError } from 'axios';
import { IEmployeeTrainingByWorkGroup, IJobTypeWithRequirements } from 'interfaces/employeeTrainingByWorkgroup';

export type State = {
  readonly error: AxiosError | null;
  readonly isFetching: boolean;
  readonly workGroups: IEmployeeTrainingByWorkGroup | null;
};

const initialState: State = {
  error: null,
  isFetching: false,
  workGroups: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_WORK_TRAININGS_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_WORK_TRAININGS_SUCCESS':
      return {
        ...state,
        error: null,
        isFetching: false,
        workGroups: action.payload.reduce(
          (
            previousObject,
            { trainingRequirement, jobTypeName, workGroupId, jobTypeId, ...otherTrainingRequirementsKeys }
          ) => ({
            ...previousObject,
            [workGroupId]: {
              ...(previousObject[workGroupId] || {}),
              workGroupId,
              jobTypes: {
                ...(previousObject[workGroupId]?.jobTypes || {}),
                [jobTypeId]: {
                  jobTypeName,
                  jobTypeId,
                  trainingRequirements: [
                    ...(previousObject[workGroupId]?.jobTypes[jobTypeId]?.trainingRequirements || []),
                    {
                      ...trainingRequirement,
                      ...otherTrainingRequirementsKeys
                    } as IJobTypeWithRequirements
                  ]
                }
              }
            }
          }),
          {} as IEmployeeTrainingByWorkGroup
        )
      };
    case 'FETCH_WORK_TRAININGS_FAILURE':
      return {
        ...state,
        error: action.error,
        isFetching: false
      };
    default:
      return state;
  }
}
