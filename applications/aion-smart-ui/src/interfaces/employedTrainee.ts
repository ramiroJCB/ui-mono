export interface IEmployedTrainee {
  firstName: string;
  lastName: string;
  emailAddress: string;
  ssnLastFour: string;
  birthDate: string;
  pecIdentifier?: string | null;
  phoneNumber: string;
  traineeId?: string;
  organizationId?: string | null;
  organizationName: string | null;
  employeeId?: string;
  userId: string | null;
}
