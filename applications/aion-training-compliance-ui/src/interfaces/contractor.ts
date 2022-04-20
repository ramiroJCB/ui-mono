export interface IContractor {
  id: string;
  clientId: string;
  organizationId: string;
  name: string;
  description?: string;
  compliantEmployeesCount: number;
  totalEmployeesCount: number;
  compliantEmployeesPercentage: number;
  employeeCountUpdatedDateUtc: string;
  isDeleted: boolean;
  contactName: string;
  contactJobTitle?: string;
  address: string;
  city: string;
  state: string;
  contactPhoneNumber?: string;
  contactMobileNumber?: string;
  contactEmail: string;
}
