import { ActivityAction } from '@pec/aion-ui-core/interfaces/activities';
import { mapUserActivities, unmapUserActivities, filterLegacyPermissionsNotOverriden } from './userActivities';

const { None, Read, Write, Manage, Audit } = ActivityAction;

const userActivitiesArray = [
  {
    resource: 'Safety Program Answers',
    action: Manage,
    isOverride: false
  },
  {
    resource: 'Safety Program Answers',
    action: Write,
    isOverride: false
  },
  {
    resource: 'Safety Program Answers',
    action: Read,
    isOverride: false
  },
  {
    resource: 'Smart Sites',
    action: Write,
    isOverride: false
  },
  {
    resource: 'Smart Sites',
    action: Read,
    isOverride: false
  },
  {
    resource: 'Training Compliance Job Types',
    action: Audit,
    isOverride: false
  },
  {
    resource: 'Training Compliance Job Types',
    action: Read,
    isOverride: false
  },
  {
    resource: 'ELearning',
    action: Audit,
    isOverride: false
  },
  {
    resource: 'ELearning',
    action: None,
    isOverride: false
  }
];

const userActivitiesMap = {
  'Safety Program Answers': {
    canAudit: false,
    override: false,
    level: 3
  },
  'Smart Sites': {
    canAudit: false,
    override: false,
    level: 2
  },
  'Training Compliance Job Types': {
    canAudit: true,
    override: false,
    level: 1
  },
  ELearning: {
    canAudit: true,
    override: false,
    level: 0
  }
};

const userActivitiesArrayToTestFilter = [
  {
    resource: 'Safety Program Answers',
    action: Manage,
    isOverride: false
  },
  {
    resource: 'ELearning',
    action: Write,
    isOverride: false
  },
  {
    resource: 'Operational Metrics',
    action: Write,
    isOverride: true
  },
  {
    resource: 'Covered Tasks',
    action: Manage,
    isOverride: true
  },
  {
    resource: 'Tasks',
    action: Write,
    isOverride: false
  },
  {
    resource: 'Users',
    action: Read,
    isOverride: false
  }
];

const activityResourcesArray = [
  {
    name: 'Safety Program Answers',
    isLegacyResource: false
  },
  {
    name: 'ELearning',
    isLegacyResource: false
  },
  {
    name: 'Operational Metrics',
    isLegacyResource: true
  },
  {
    name: 'Covered Tasks',
    isLegacyResource: true
  },
  {
    name: 'Tasks',
    isLegacyResource: true
  },
  {
    name: 'Users',
    isLegacyResource: true
  }
];

const filteredUserActivities = [
  {
    resource: 'Safety Program Answers',
    action: Manage,
    isOverride: false
  },
  {
    resource: 'ELearning',
    action: Write,
    isOverride: false
  },
  {
    resource: 'Operational Metrics',
    action: Write,
    isOverride: true
  },
  {
    resource: 'Covered Tasks',
    action: Manage,
    isOverride: true
  }
];

describe('mapUserActivities', () => {
  it('converts an array of scoped user activities into a form-friendly map', () => {
    expect(mapUserActivities(userActivitiesArray)).toEqual(userActivitiesMap);
  });
});

describe('unmapUserActivities', () => {
  it('converts a map of user activities into a payload-friendly array', () => {
    expect(unmapUserActivities(userActivitiesMap)).toEqual(userActivitiesArray);
  });
});

describe('filterLegacyPermissionsNotOverriden', () => {
  it('removes legacy permissions from the userActivities array which have not been overridden', () => {
    expect(filterLegacyPermissionsNotOverriden(userActivitiesArrayToTestFilter, activityResourcesArray)).toEqual(
      filteredUserActivities
    );
  });
});
