import { employeesWithTrainee } from '../../fixtures/employeesWithTrainee';
import { formatSelectedTrainee, formatTraineeWithNewEmployer, formatUserInput } from './formatTrainee';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';

describe('properly formats trainee data', () => {
  const formData = {
    birthDate: '1987-02-03',
    emailAddress: 'yoohoo@yoho.com',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '1112223333',
    ssnLastFour: '1234',
    organization: {
      id: 'e1c2209a-048a-4f14-80db-43400a640e56',
      name: 'Smith&Sons'
    }
  };

  const formDataB = {
    birthDate: '1987-02-03',
    emailAddress: 'yoohoo@yoho.com',
    firstName: 'John',
    lastName: 'Smith',
    phoneNumber: '1112223333',
    ssnLastFour: '1234',
    organization: {
      id: '00000000-0000-0000-0000-000000000000',
      name: 'Smith&Sons'
    }
  };

  const traineeRecord: ITraineeWithEmployees = {
    id: 'e9687e0d-d9fc-45da-83d7-801423c3a75a',
    addressLine1: null,
    addressLine2: null,
    birthDate: '0001-01-01T00:00:00',
    city: null,
    country: null,
    createdDate: '2017-01-12T00:00:00',
    emailAddress: 'anotherPlace@anothertime.biz',
    employees: employeesWithTrainee,
    firstName: 'A D',
    isDeleted: false,
    lastName: 'MCKAY',
    middleInitial: null,
    nameSuffix: null,
    pecIdentifier: 'PEC123456789',
    photoUrl: null,
    phoneNumber: null,
    ssnLastFour: '5275',
    state: null,
    updatedDate: '2019-02-03T00:00:00',
    userId: '73a5085d-fbd1-4994-9ff1-8c796d608ed8',
    zip: null
  };

  describe('formats user-inputted data', () => {
    it('properly formats a newly entered organization', () => {
      expect(formatUserInput(formDataB)).toHaveProperty('organizationId', null);
    });
    it('properly formats existing organizations', () => {
      expect(formatUserInput(formData)).toHaveProperty('organizationId', 'e1c2209a-048a-4f14-80db-43400a640e56');
    });
  });

  describe('properly formats selected trainee data with user-inputted data', () => {
    it('sends the traineeId if user selects a trainee record', () => {
      expect(formatSelectedTrainee(formData, traineeRecord)).toHaveProperty(
        'traineeId',
        'e9687e0d-d9fc-45da-83d7-801423c3a75a'
      );
    });
    it('sends the emailAddress from userInput', () => {
      expect(formatSelectedTrainee(formData, traineeRecord)).toHaveProperty('emailAddress', 'yoohoo@yoho.com');
    });
  });

  describe('properly formats trainee data with new employer info', () => {
    const newOrg = {
      organization: {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'First Coast Drills, Inc'
      }
    };
    const existingOrg = {
      organization: {
        id: '8cbde110-60bf-451c-be69-2fb57f03cb08',
        name: 'Beck Engineering Co.'
      }
    };
    it('properly formats a newly entered organization', () => {
      expect(formatTraineeWithNewEmployer(newOrg, traineeRecord.id)).toMatchObject({
        organizationId: null,
        organizationName: newOrg.organization.name,
        traineeId: traineeRecord.id
      });
    });
    it('properly formats existing organizations', () => {
      expect(formatTraineeWithNewEmployer(existingOrg, traineeRecord.id)).toMatchObject({
        organizationId: existingOrg.organization.id,
        organizationName: existingOrg.organization.name,
        traineeId: traineeRecord.id
      });
    });
  });
});
