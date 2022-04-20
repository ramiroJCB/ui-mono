import * as faker from 'faker';
import { SafetyProgramRequirementStatus } from '../../../packages/aion-ui-core/src/interfaces/safetyProgramRequirementStatus';

const {
  Incomplete,
  Completable,
  SubmittedNotApplicable,
  SubmittedComplete,
  AcceptedNotApplicable,
  Accepted,
  Rejected
} = SafetyProgramRequirementStatus;

export const randomRequirementStatus = () =>
  faker.random.arrayElement([
    Incomplete,
    Completable,
    SubmittedNotApplicable,
    SubmittedComplete,
    AcceptedNotApplicable,
    Accepted,
    Rejected
  ]);
