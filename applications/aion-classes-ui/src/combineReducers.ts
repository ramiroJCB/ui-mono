import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import { reducer as reservation, State as ReservationState } from './features/reservation/reducer';
import { reducer as reservations, State as ReservationsState } from './features/reservations/reducer';
import { reducer as trainingClass, State as TrainingClassState } from './features/class/reducer';
import { reducer as trainingClasses, State as TrainingClassesState } from './features/classes/reducer';
import {
  reducer as classReservationAggregates,
  State as ClassReservationAggregatesState
} from './features/reports/reservations/ReservationsList/reducer';
import {
  reducer as reservationMetrics,
  State as ReservationMetricsState
} from './features/reports/reservations/ReservationMetrics/reducer';
import { reducer as creators, State as CreatorsState } from './features/reports/reservations/creators/reducer';
import {
  reducer as reservationReportFilters,
  State as ReservationReportFiltersState
} from './features/reports/reservations/filters/reducer';
import { reducer as filters, State as FiltersState } from 'features/filters/reducer';
import { reducer as programs, State as ProgramsState } from 'features/programs/reducer';
import { reducer as providers, State as ProvidersState } from 'features/providers/reducer';
import { RootActions } from 'combineActions';

type AppRootState = {
  creators: CreatorsState;
  filters: FiltersState;
  programs: ProgramsState;
  providers: ProvidersState;
  reservation: ReservationState;
  reservationMetrics: ReservationMetricsState;
  reservationReportFilters: ReservationReportFiltersState;
  reservations: ReservationsState;
  trainingClass: TrainingClassState;
  trainingClasses: TrainingClassesState;
  classReservationAggregates: ClassReservationAggregatesState;
};

export type RootState = AppRootState & CommonRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  classReservationAggregates,
  creators,
  filters,
  programs,
  providers,
  reservation,
  reservationMetrics,
  reservationReportFilters,
  reservations,
  trainingClass,
  trainingClasses
});
