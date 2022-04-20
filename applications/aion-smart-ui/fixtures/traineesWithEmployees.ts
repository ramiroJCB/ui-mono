import { employees } from './employees';
import { IEmployeeWithOrganization } from '../../../packages/aion-ui-core/src/interfaces/employee';
import { ITraineeWithEmployees } from '../../../packages/aion-ui-core/src/interfaces/trainee';
import { trainees } from '../../../packages/aion-ui-core/src/fixtures/trainees';

export const traineesWithEmployees: ITraineeWithEmployees[] = [];

trainees.map(t => {
  const matchedEmployees: IEmployeeWithOrganization[] = employees.filter(e => e.traineeId === t.id);
  traineesWithEmployees.push({
    ...t,
    employees: matchedEmployees
  });
});
