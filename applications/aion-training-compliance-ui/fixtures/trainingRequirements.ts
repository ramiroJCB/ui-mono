import {
  ExpirationUnits,
  ITrainingRequirement
} from '../../../packages/aion-ui-core/src/interfaces/trainingRequirement';

export const trainingRequirements: ITrainingRequirement[] = [
  {
    id: '31e35e31-0854-421e-80c6-02bf09fa24c4',
    organizationId: '96e395dd-153c-41fd-9dcd-2034720becf0',
    name: 'Aglax East',
    description: 'description string',
    expirationMillis: 94694400000,
    expirationUnits: ExpirationUnits.Years,
    uploadRequired: true,
    compliantContractorCount: 35,
    totalContractorCount: 79,
    oshaReferenceNumbers: null,
    compliantContractorPercentage: 0.44303,
    contractorCountUpdatedDateUtc: '2017-01-02T03:00:00Z',
    isDeleted: true
  }
];
