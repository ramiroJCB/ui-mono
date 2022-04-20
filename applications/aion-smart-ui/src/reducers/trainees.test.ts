import { initialState, reducer, State } from './trainees';
import { traineesWithEmployees as trainees } from '../../fixtures/traineesWithEmployees';

let prevState: State;

beforeEach(() => {
  prevState = { ...initialState, trainees: trainees };
});

describe('trainees reducer', () => {
  it('renders a loading spinner while adding new employee record to trainee', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_TRAINEE_EMPLOYER_REQUEST'
    });

    expect(prevState.isFetching).toBe(false);
    expect(nextState.isFetching).toBe(true);
  });
  it('adds new employee record to trainee in state', () => {
    const newEmployeeId = '2a1a333f-2b99-4e75-acc8-2b3f64167a52';
    const updatedTraineeId = prevState.trainees[1].id;

    const nextState = reducer(prevState, {
      type: 'ADD_TRAINEE_EMPLOYER_SUCCESS',
      payload: {
        traineeId: updatedTraineeId,
        organizationId: '7e1fdcc4-a511-4064-886d-30446cb880bc',
        employeeId: newEmployeeId
      },
      orgName: 'Coyote Ugly'
    });

    expect(nextState.isFetching).toBe(false);
    expect(nextState.error).toBeNull();
    expect(nextState.trainees).not.toEqual(trainees);
    expect(nextState.trainees[0].id).toMatch(updatedTraineeId);
    expect(nextState.trainees[0].employees[0].id).toBe(newEmployeeId);
    expect(nextState.trainees.find(({ id }) => id === updatedTraineeId).employees.map(({ id }) => id)).toContain(
      newEmployeeId
    );
    expect(prevState.trainees.find(({ id }) => id === updatedTraineeId).employees.map(({ id }) => id)).not.toContain(
      newEmployeeId
    );
  });
});
