import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { canChangeIsRead, canDeleteComment } from './comment';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { UserInfoActivitiesType } from '@pec/aion-ui-core/interfaces/userInfo';

const { Read, Write, Manage } = ActivityAction;
const { SafetyProgramEvaluations, SafetyPrograms } = ActivityResourceName;
const { Global, Organization } = UserInfoActivitiesType;
const { Accepted, Incomplete, Rejected } = SafetyProgramRequirementStatus;

const userInfoFiller = {
  userId: '',
  userName: 'artemis',
  fullName: '',
  emailAddress: null,
  primaryOrganizationId: ''
};

describe('canChangeIsRead', () => {
  const activities = {
    [SafetyProgramEvaluations]: [Read, Write, Manage]
  };

  it("is true for an evaluator looking at a contractor user's comment", () => {
    expect(
      canChangeIsRead(
        {
          ...userInfoFiller,
          activities: [
            {
              id: null,
              type: Global,
              activities
            }
          ]
        },
        false
      )
    ).toBe(true);
  });

  it("is false for an evaluator looking at another evaluator's comment", () => {
    expect(
      canChangeIsRead(
        {
          ...userInfoFiller,
          activities: [
            {
              id: null,
              type: Global,
              activities
            }
          ]
        },
        true
      )
    ).toBe(false);
  });

  it("is true for a contractor user looking at an evaluator's comment", () => {
    expect(
      canChangeIsRead(
        {
          ...userInfoFiller,
          activities: [
            {
              id: '24d42a53-9360-45ca-9d9d-8d008d3d8e58',
              type: Organization,
              activities
            }
          ]
        },
        true
      )
    ).toBe(true);
  });

  it("is false for a contractor user looking at another contractor user's comment", () => {
    expect(
      canChangeIsRead(
        {
          ...userInfoFiller,
          activities: [
            {
              id: '24d42a53-9360-45ca-9d9d-8d008d3d8e58',
              type: Organization,
              activities
            }
          ]
        },
        false
      )
    ).toBe(false);
  });
});

describe('canDeleteComment', () => {
  const adminActivities = [
    {
      id: null,
      type: Global,
      activities: {
        [SafetyPrograms]: [Read, Write, Manage]
      }
    }
  ];

  const evaluatorActivities = [
    {
      id: null,
      type: Global,
      activities: {
        [SafetyProgramEvaluations]: [Read, Write, Manage]
      }
    }
  ];

  const commentFiller = {
    id: '',
    questionAnswerId: '',
    contractorId: '',
    comments: '',
    isRead: false,
    createdDateUtc: ''
  };

  it("is true for an admin looking at an evaluator's comment", () => {
    expect(
      canDeleteComment(
        {
          ...userInfoFiller,
          activities: adminActivities
        },
        Accepted,
        {
          ...commentFiller,
          createdBy: '',
          isEvaluatorComment: true
        }
      )
    ).toBe(true);
  });

  it("is true for an admin looking at a contractor user's comment on a non-submitted requirement", () => {
    expect(
      canDeleteComment(
        {
          ...userInfoFiller,
          activities: adminActivities
        },
        Incomplete,
        {
          ...commentFiller,
          createdBy: '',
          isEvaluatorComment: false
        }
      )
    ).toBe(true);
  });

  it("is false for an admin looking at a contractor user's comment on a submitted requirement", () => {
    expect(
      canDeleteComment(
        {
          ...userInfoFiller,
          activities: adminActivities
        },
        Accepted,
        {
          ...commentFiller,
          createdBy: '',
          isEvaluatorComment: false
        }
      )
    ).toBe(false);
  });

  it('is true for a non-admin looking at their own comment on a non-submitted requirement', () => {
    expect(
      canDeleteComment({ ...userInfoFiller, activities: [] }, Incomplete, {
        ...commentFiller,
        createdBy: 'artemis',
        isEvaluatorComment: true
      })
    ).toBe(true);
  });

  it('is false for a non-admin looking at their own comment on a submitted requirement', () => {
    expect(
      canDeleteComment({ ...userInfoFiller, activities: [] }, Accepted, {
        ...commentFiller,
        createdBy: 'artemis',
        isEvaluatorComment: true
      })
    ).toBe(false);
  });

  it('is false for an evaluator looking at their own comment on a rejected requirement', () => {
    expect(
      canDeleteComment(
        {
          ...userInfoFiller,
          activities: evaluatorActivities
        },
        Rejected,
        {
          ...commentFiller,
          createdBy: 'artemis',
          isEvaluatorComment: true
        }
      )
    ).toBe(false);
  });

  it("is false for a non-admin looking at someone else's comment", () => {
    expect(
      canDeleteComment({ ...userInfoFiller, activities: [] }, Incomplete, {
        ...commentFiller,
        createdBy: '',
        isEvaluatorComment: true
      })
    ).toBe(false);
  });
});
