import * as faker from 'faker';
import { IClassReservationAggregate } from '../src/interfaces/classReservationAggregate';
import { reservations } from './reservations';
import { ReservationStatus } from '../../../packages/aion-ui-core/src/interfaces/reservation';
import { trainingClasses } from './trainingClasses';

export const classReservationAggregates: IClassReservationAggregate[] = [];
export let totalActiveReservations: number = 0; // used to calculate reservationMetrics fixture

reservations
  .filter(r => r.status === ReservationStatus.Active)
  .map(r => {
    const tc = trainingClasses.find(tc => tc.id === r.classId);
    if (tc) {
      totalActiveReservations += tc.meta.totalActiveReservations;
      const provider = tc.trainingProvider
        ? { id: tc.trainingProvider.id, name: tc.trainingProvider.name, types: tc.trainingProvider.types }
        : null;
      classReservationAggregates.push({
        id: faker.random.uuid(),
        program: tc.program,
        trainingProvider: provider,
        primaryInstructor: tc.primaryInstructor,
        location: tc.location,
        trainingClassStartDateUtc: tc.startDate,
        supportedLanguages: tc.supportedLanguages,
        organizationId: r.organizationId,
        organizationName: r.organizationName,
        maxReservations: tc.studentCapacity,
        reservedSeatsCount: r.reservedSeatsCount,
        pricePerStudent: tc.pricePerStudent,
        reservationStatus: r.status,
        trainingClassStatus: tc.status,
        source: r.source,
        contact: r.contact,
        createdBy: r.createdBy,
        reservationCreatedDateUtc: r.createdDateUtc,
        updatedBy: r.updatedBy,
        reservationUpdatedDateUtc: r.updatedDateUtc
      });
    }
  });
