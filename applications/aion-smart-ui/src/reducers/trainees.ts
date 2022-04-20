import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IEmployeeWithOrganization } from '@pec/aion-ui-core/interfaces/employee';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { TraineesActions as Actions } from 'combineActions';

export type State = DeepReadonly<{
  isFetching: boolean;
  trainees: ITraineeWithEmployees[] | null;
  error: AxiosError | Error | null;
  pecIdentifier: string | null;
}>;

export const initialState: State = {
  isFetching: false,
  trainees: null,
  error: null,
  pecIdentifier: null
};

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case 'FETCH_TRAINEES_REQUEST':
    case 'ADD_TRAINEE_EMPLOYER_REQUEST':
      return {
        ...state,
        isFetching: true
      };
    case 'FETCH_TRAINEES_SUCCESS':
      return {
        isFetching: false,
        trainees: action.payload,
        error: null,
        pecIdentifier: action.pecIdentifier
      };
    case 'FETCH_TRAINEES_FAILURE':
    case 'ADD_TRAINEE_EMPLOYER_FAILURE':
      return {
        ...state,
        isFetching: false,
        error: action.error
      };
    case 'ADD_TRAINEE_EMPLOYER_SUCCESS':
      const { employeeId, organizationId, traineeId } = action.payload;
      const newEmployee: DeepReadonly<IEmployeeWithOrganization> = {
        id: employeeId,
        organization: {
          id: organizationId,
          name: action.orgName,
          features: [],
          primaryAddress: null,
          secondaryAddress: null,
          city: null,
          state: null,
          country: null,
          zipCode: null,
          phoneNumber: null,
          phoneNumberExtension: null,
          emailAddress: null,
          clientFeatures: null
        },
        comments: '',
        createdDate: '',
        isDeleted: false,
        organizationEmployeeId: null,
        organizationId: organizationId,
        startDate: '',
        status: 0,
        traineeId: traineeId,
        updatedDate: ''
      };

      return {
        ...state,
        isFetching: false,
        trainees:
          state.trainees &&
          [...state.trainees]
            .sort((a, b) => (a.id === traineeId ? -1 : b.id === traineeId ? 1 : 0))
            .map(t =>
              t.id === traineeId
                ? {
                    ...t,
                    employees: [newEmployee].concat(t.employees)
                  }
                : t
            )
      };
    default:
      return state;
  }
}
