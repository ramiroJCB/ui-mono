import { Actions as FetchTrainingClassActions } from './features/class/actions';
import { Actions as FetchTrainingClassesActions } from './features/classes/actions';
import { Actions as FetchClassReservationAggregatesActions } from './features/reports/reservations/ReservationsList/actions';
import { Actions as FetchReservationMetricsActions } from './features/reports/reservations/ReservationMetrics/actions';
import { Actions as FetchReservationReportFiltersActions } from './features/reports/reservations/filters/actions';
import { Actions as FetchCreatorsActions } from './features/reports/reservations/creators/actions';
import { Actions as FetchReservationsActions } from 'features/reservations/actions';
import { Actions as AddReservationActions } from 'features/reservation/actions/addReservation';
import { Actions as FetchReservationActions } from 'features/reservation/actions/fetchReservation';
import { Actions as UpdateReservationActions } from 'features/reservation/actions/updateReservation';
import { Actions as FiltersActions } from 'features/filters/actions';
import { Actions as FetchProgramsActions } from 'features/programs/actions/fetchPrograms';
import { Actions as FetchBasicProgramsActions } from 'features/programs/actions/fetchBasicPrograms';
import { Actions as ProvidersActions } from 'features/providers/actions';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

export type ProgramsActions = FetchBasicProgramsActions | FetchProgramsActions;
export type ReservationActions = AddReservationActions | FetchReservationActions | UpdateReservationActions;
export type ReservationsActions = FetchReservationsActions;
export type ReservationsReportActions =
  | FetchClassReservationAggregatesActions
  | FetchCreatorsActions
  | FetchReservationMetricsActions
  | FetchReservationReportFiltersActions;
export type TrainingClassActions = FetchTrainingClassActions;
export type TrainingClassesActions = FetchTrainingClassesActions;

export type RootActions =
  | CommonRootActions
  | FiltersActions
  | ProgramsActions
  | ProvidersActions
  | ReservationActions
  | ReservationsActions
  | ReservationsReportActions
  | TrainingClassActions
  | TrainingClassesActions;
