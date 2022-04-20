export interface IPECEmployee {
  id: string;
  organizationEmployeeId: string;
  employeeStatus: string;
  startDate: string;
  traineeId: string;
  organizationId: string;
  CreatedDate: string;
  UpdatedDate: string;
  traineeFirstName: string;
  traineeLastName: string;
  traineeBirthDate: string;
  isDeleted: boolean;
  origin?: 'PEC' | 'Verisource';
  traineePecIdentifier: string;
  verisourceEmployeeId: string | null;
}
