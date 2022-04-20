export interface IOverrideHistory {
  id: string;
  organizationName: string;
  actionType: OverrideActionType;
  username: string;
  dateUtc: string;
  comment: string;
}

export enum OverrideActionType {
  Approved = 'Approved',
  Cancelled = 'Cancelled',
  Granted = 'Granted',
  Denied = 'Denied',
  Requested = 'Requested',
  Removed = 'Removed',
  CommentChange = 'Comment Change'
}
