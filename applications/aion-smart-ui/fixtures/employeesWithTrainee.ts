import { employees } from './employees';
import { IEmployeeWithTrainee } from '../../../packages/aion-ui-core/src/interfaces/employee';
import { trainees } from '../../../packages/aion-ui-core/src/fixtures/trainees';

export const employeesWithTrainee: IEmployeeWithTrainee[] = [];

employees.map(e => {
  const matchedTrainee = trainees.filter(t => t.id === e.traineeId).shift();

  if (matchedTrainee) {
    employeesWithTrainee.push({
      ...e,
      trainee: matchedTrainee
    });
  }
});
