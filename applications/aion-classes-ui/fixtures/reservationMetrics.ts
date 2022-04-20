import { classReservationAggregates, totalActiveReservations } from './classReservationAggregates';

let totalSeats = 0;
let totalValue = 0;

classReservationAggregates.forEach(c => {
  totalSeats += c.reservedSeatsCount;
  totalValue += c.reservedSeatsCount * Number(c.pricePerStudent);
});

const totalReservations = totalActiveReservations;

export const reservationMetrics = {
  totalSeats,
  totalReservations,
  totalValue,
  averageSeats: Math.round(totalSeats / totalReservations),
  averageSeatValue: totalValue / totalSeats,
  averageValue: totalValue / totalReservations
};
