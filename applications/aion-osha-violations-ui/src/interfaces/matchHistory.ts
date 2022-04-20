import { CurrentStatus } from './oshaViolations';

export interface IMatchHistory {
  id: string;
  oshaViolationId: string;
  userId: string;
  userName: string;
  eventDateUtc: string;
  reasonForAction: string;
  status: CurrentStatus;
  createdBy: string;
  updatedBy: string;
  createdDateUtc: string;
  updatedDateUtc: string;
  hasStatusChanged: boolean;
}
