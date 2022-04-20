import {
  IPrimaryInstructor,
  ITrainingClassLocation,
  TrainingClassLanguage,
  TrainingClassStatus
} from '@pec/aion-ui-core/interfaces/trainingClass';
import {
  IReservationContact,
  IReservationsUser,
  ReservationSource,
  ReservationStatus
} from '@pec/aion-ui-core/interfaces/reservation';
import { ITrainingProgram } from '@pec/aion-ui-core/interfaces/trainingProgram';
import { ITrainingProviderType } from '@pec/aion-ui-core/interfaces/trainingProvider';

export interface IClassReservationAggregate {
  id: string;
  program: ITrainingProgram;
  trainingProvider: {
    id: string;
    name: string;
    types: ITrainingProviderType[];
  } | null;
  primaryInstructor: IPrimaryInstructor;
  location: ITrainingClassLocation;
  trainingClassStartDateUtc: string;
  supportedLanguages: TrainingClassLanguage[];
  organizationId: string;
  organizationName: string;
  maxReservations: number;
  reservedSeatsCount: number;
  pricePerStudent: string;
  reservationStatus: ReservationStatus;
  trainingClassStatus: TrainingClassStatus;
  source: ReservationSource;
  contact: IReservationContact;
  createdBy: IReservationsUser;
  reservationCreatedDateUtc: string;
  updatedBy: IReservationsUser | null;
  reservationUpdatedDateUtc: string | null;
}
