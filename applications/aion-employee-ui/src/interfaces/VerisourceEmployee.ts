export interface IVerisourceEmployee {
  employeeId: number;
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  companyId: number;
  pecEmployeeId: string | null;
  oqsgId: string;
  origin?: 'PEC' | 'Verisource';
}
