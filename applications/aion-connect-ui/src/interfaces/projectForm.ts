export interface IProjectForm {
  name: string;
  startDateUtc: string;
  endDateUtc: string | null;
  isActive: boolean;
  description: string;
}
