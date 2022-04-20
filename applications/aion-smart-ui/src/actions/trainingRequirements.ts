import axios, { AxiosError } from 'axios';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { RootState } from 'combineReducers';
import { sendError } from '@pec/aion-ui-core/sendError';
import { ThunkAction } from 'redux-thunk';

const fetchTrainingRequirementsRequest = () =>
  ({
    type: 'FETCH_TRAINING_REQUIREMENTS_REQUEST'
  } as const);

const fetchTrainingRequirementsSuccess = (payload: IEmployeeTrainingRequirement[], employeeId: string) =>
  ({
    type: 'FETCH_TRAINING_REQUIREMENTS_SUCCESS',
    payload,
    employeeId
  } as const);

const fetchTrainingRequirementsFailure = (error: AxiosError) => {
  sendError(error);
  return {
    type: 'FETCH_TRAINING_REQUIREMENTS_FAILURE',
    error
  } as const;
};

const shouldFetchTrainingRequirements = (
  { trainingRequirements: { isFetching, employeeId: lastEmployeeId } }: RootState,
  employeeId: string
) => !isFetching && lastEmployeeId !== employeeId;

const fetchTrainingRequirements = (
  employeeId: string
): ThunkAction<void, RootState, null, Actions> => async dispatch => {
  try {
    dispatch(fetchTrainingRequirementsRequest());

    const response = await axios.get<IEmployeeTrainingRequirement[]>(
      `/spapi/employees/${employeeId}/trainingRequirements`
    );

    dispatch(fetchTrainingRequirementsSuccess(response.data, employeeId));
  } catch (error) {
    dispatch(fetchTrainingRequirementsFailure(error));
  }
};

export const fetchTrainingRequirementsIfNeeded = (employeeId: string): ThunkAction<void, RootState, null, Actions> => (
  dispatch,
  getState
) => {
  if (shouldFetchTrainingRequirements(getState(), employeeId)) {
    dispatch(fetchTrainingRequirements(employeeId));
  }
};

export type Actions =
  | ReturnType<typeof fetchTrainingRequirementsRequest>
  | ReturnType<typeof fetchTrainingRequirementsSuccess>
  | ReturnType<typeof fetchTrainingRequirementsFailure>;
