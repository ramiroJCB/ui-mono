import { trainees as commonTrainees, userInfo as commonUserInfo } from '../../../packages/aion-ui-core/src/fixtures';
export {
  contractorTasks,
  errors,
  serverTokens,
  userOrganizations,
  veriforceOrganizationLinks
} from '../../../packages/aion-ui-core/src/fixtures';
export { traineeCourseCredits } from './traineeCourseCredits';

const { userId } = commonUserInfo;

export const trainees = commonTrainees.map((t, i) => ({
  ...t,
  pecIdentifier: i.toString(),
  userId
}));

export const userInfo = commonUserInfo;
