export interface IProject {
  id: string;
  name: string;
  startDateUtc: string;
  endDateUtc: string | null;
  isActive: boolean;
  description: string;
  organizationId: string;
  isDeleted: boolean;
}
