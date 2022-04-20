import { ActivityAction } from '@pec/aion-ui-core/interfaces/activities';
import { IActivityResource } from 'interfaces/activityResource';
import { IUserActivity, IUserActivityMap } from 'interfaces/userActivity';

const { None, Read, Write, Manage, Audit } = ActivityAction;

export const orderedActions = [None, Read, Write, Manage] as ActivityAction[];

export const mapUserActivities = (userActivities: Partial<IUserActivity>[]): IUserActivityMap =>
  userActivities.reduce((a, { resource, action, isOverride }) => {
    if (resource && action) {
      if (!a[resource]) {
        a[resource] = {
          canAudit: false,
          level: 0,
          override: false
        };
      }
      const mappedUserActivity = a[resource];
      if (action === Audit) {
        mappedUserActivity.canAudit = true;
      } else {
        mappedUserActivity.level = Math.max(mappedUserActivity.level, orderedActions.indexOf(action));
        mappedUserActivity.override = isOverride ? true : false;
      }
    }
    return a;
  }, {} as IUserActivityMap);

export const unmapUserActivities = (userActivityMap: IUserActivityMap): Partial<IUserActivity>[] =>
  Object.keys(userActivityMap).reduce((a, resource) => {
    const { canAudit, level, override } = userActivityMap[resource];
    if (canAudit) {
      a.push({
        resource,
        action: Audit,
        isOverride: false
      });
    }
    if (level === 0) {
      a.push({
        resource,
        action: orderedActions[0],
        isOverride: override ? true : false
      });
    }
    for (let i = level; i > 0; i -= 1) {
      a.push({
        resource,
        action: orderedActions[i],
        isOverride: override ? true : false
      });
    }
    return a;
  }, [] as Partial<IUserActivity>[]);

export const filterLegacyPermissionsNotOverriden = (
  userActivities: Partial<IUserActivity>[],
  activityResources: IActivityResource[]
) => {
  const legacyActivities = activityResources
    .filter(({ isLegacyResource }) => isLegacyResource)
    .map(resource => {
      return resource['name'];
    });

  const filteredActivities = userActivities.filter(
    activity =>
      (activity.resource && !legacyActivities.includes(activity.resource)) ||
      (activity.resource && activity.isOverride && legacyActivities.includes(activity.resource))
  );

  return filteredActivities;
};
