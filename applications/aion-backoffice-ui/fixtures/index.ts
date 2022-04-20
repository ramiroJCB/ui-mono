import { userInfo as _userInfo } from '../../../packages/aion-ui-core/src/fixtures';
import { UserInfoActivitiesType } from '../../../packages/aion-ui-core/src/interfaces/userInfo';
export {
  errors,
  serverTokens,
  userOrganizations,
  organizationFeatures
} from '../../../packages/aion-ui-core/src/fixtures';

export const userInfo = {
  ..._userInfo,
  activities: [
    {
      id: null,
      type: UserInfoActivitiesType.Global,
      activities: _userInfo.activities[1].activities
    }
  ]
};
