// PI-890: Adding the old ITrainee interface to this project since there's not enough time / backend resources to
// update all of the endpoints that would be necessary to make this project work with the new ITrainee/IEmployee interfaces,
// after they were split for SMAR-334.

export enum EmployeeStatus {
  Active,
  Inactive
}

export interface ITrainee {
  readonly id: string;
  readonly employeeId: string | null;
  readonly userId: string | null;
  readonly testId: string | null;
  readonly organizationId: string | null;
  readonly organizationName: string | null;
  readonly emailAddress: string | null;
  readonly phoneNumber: string | null;
  readonly firstName: string;
  readonly middleInitial: string | null;
  readonly lastName: string;
  readonly nameSuffix: string | null;
  readonly photoUrl: string | null;
  readonly photoUpload: string | null;
  readonly birthDate: string | null;
  readonly ssnLastFour: string | null;
  readonly addressLine1: string | null;
  readonly addressLine2: string | null;
  readonly city: string | null;
  readonly state: string | null;
  readonly zip: string | null;
  readonly country: string | null;
  readonly mobilePhoneNumber: string | null;
  readonly pecIdentifier: string | null;
  readonly oqProviderId: string | null;
  readonly status: EmployeeStatus;
  readonly startDate: string;
  readonly organizationEmployeeId: string | null;
  readonly comments: string | null;
  readonly createdDate: string;
  readonly updatedDate: string;
}
