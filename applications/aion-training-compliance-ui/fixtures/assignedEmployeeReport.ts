import * as faker from 'faker';
import {
  IWorkGroupJobTypeEmployeeTraining,
  ValidationStatus
} from '../../../packages/aion-ui-core/src/interfaces/workGroupJobTypeEmployeeTraining';

export const assignedEmployeeReport: IWorkGroupJobTypeEmployeeTraining[] = Array(250)
  .fill(null)
  .map(() => ({
    workGroupJobTypeEmployeeId: faker.random.uuid(),
    jobTypeTrainingRequirementId: faker.random.uuid(),
    organizationId: faker.random.uuid(),
    contractorId: faker.random.uuid(),
    contractorName: faker.company.companyName(),
    employeeId: faker.random.uuid(),
    employeeName: faker.name.findName(),
    employeeTrainingRequirementId: faker.random.uuid(),
    workGroupId: faker.random.uuid(),
    workGroupName: faker.random.words(),
    jobTypeId: faker.random.uuid(),
    jobTypeName: faker.random.words(),
    trainingRequirementId: faker.random.uuid(),
    trainingRequirementName: faker.random.words(),
    isCompliant: faker.random.boolean(),
    isDeleted: faker.random.boolean(),
    completionDateUtc: faker.date.past().toDateString(),
    completionDateUpdatedUtc: faker.date.past().toDateString(),
    expirationDateUtc: faker.date.future().toDateString(),
    compliantStatusUpdatedDateUtc: faker.date.past().toDateString(),
    validatingCompany: faker.random.arrayElement([ValidationStatus.PECValidated, ValidationStatus.SelfValidated]),
    hasDocument: faker.random.boolean()
  }));
