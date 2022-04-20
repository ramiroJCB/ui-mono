import { ExpirationUnits } from '@pec/aion-ui-core/interfaces/trainingRequirement';

export interface IAddTrainingForm {
  name: string;
  organizationId: string;
  description: string;
  expirationMillis: number | null;
  expirationUnits: ExpirationUnits | null;
  uploadRequired: boolean;
}
