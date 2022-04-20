export interface IEmployee {
  id: string;
  organizationId: string;
  traineeId: string;
  employeeId: string;
  name: string;
  emailAdress: string | null;
  phoneNumber: string | null;
  mobilePhoneNumber: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  compliantTrainingCount: number;
  totalTrainingCount: number;
  compliantTrainingPercentage: number;
  trainingCountUpdatedDateUtc: string;
  isDeleted: boolean;
}
