export const getTotalSeatsAvailable = (totalSeatsReserved: number, maxReservations: number) =>
  Math.max(0, maxReservations - totalSeatsReserved);
