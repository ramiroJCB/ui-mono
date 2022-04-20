import { IChangeEmployerForm } from 'interfaces/changeEmployerForm';
import { IEmployedTrainee } from 'interfaces/employedTrainee';
import { INewTraineeEmployer } from 'interfaces/newTraineeEmployer';
import { ISearchTraineesForm } from 'interfaces/searchTraineesForm';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';

const emptyGuid = '00000000-0000-0000-0000-000000000000';

export const formatUserInput = (userInput: ISearchTraineesForm): IEmployedTrainee => {
  const organizationId = userInput.organization.id === emptyGuid ? null : userInput.organization.id;

  return {
    ...userInput,
    organizationId,
    organizationName: userInput.organization.name,
    emailAddress: userInput.emailAddress,
    userId: null
  };
};

export const formatSelectedTrainee = (
  userInput: ISearchTraineesForm,
  trainee: ITraineeWithEmployees,
  selectedEmployee?: number
): IEmployedTrainee => {
  const userProvidedOrg = userInput.organization;

  const organizationId = selectedEmployee
    ? trainee.employees[selectedEmployee].organizationId
    : userProvidedOrg.id === emptyGuid
    ? null
    : userProvidedOrg.id;

  const organizationName = selectedEmployee
    ? trainee.employees[selectedEmployee].organization.name
    : userProvidedOrg.name;

  return {
    ...trainee,
    organizationId,
    organizationName,
    traineeId: trainee.id,
    pecIdentifier: trainee.pecIdentifier,
    emailAddress: userInput.emailAddress,
    birthDate: trainee.birthDate || userInput.birthDate,
    phoneNumber: trainee.phoneNumber || userInput.phoneNumber,
    ssnLastFour: trainee.ssnLastFour || userInput.ssnLastFour
  };
};

export const formatTraineeWithNewEmployer = (newOrg: IChangeEmployerForm, traineeId: string): INewTraineeEmployer => {
  const organizationId = newOrg.organization.id === emptyGuid ? null : newOrg.organization.id;

  return {
    organizationId,
    organizationName: newOrg.organization.name,
    traineeId
  };
};
