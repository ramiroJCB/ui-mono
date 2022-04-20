import { ActivityAction } from '@pec/aion-ui-core/interfaces/activities';

export interface IUserActivity {
  id: string;
  resource: string;
  action: ActivityAction;
  organizationId: string | null;
  userId: string;
  forUserId: string | null;
  isOverride: boolean;
}

export interface IUserActivityMap {
  [resource: string]: {
    canAudit: boolean;
    level: number;
    override: boolean;
  };
}
