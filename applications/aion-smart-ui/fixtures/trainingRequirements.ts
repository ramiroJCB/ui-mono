import { IEmployeeTrainingRequirement } from '../src/interfaces/employeeTrainingRequirement';

export const trainingRequirements: IEmployeeTrainingRequirement[] = [
  {
    name: 'SafeLandUSA',
    isCertified: Math.random() > 0.5
  },
  {
    name: 'SafeGulf',
    isCertified: Math.random() > 0.5
  },
  {
    name: 'PEC H2S Clear',
    isCertified: Math.random() > 0.5
  },
  {
    name: 'PEC Core',
    isCertified: Math.random() > 0.5
  }
];
