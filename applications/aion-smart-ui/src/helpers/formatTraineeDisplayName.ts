export const formatTraineeDisplayName = (firstName: string, lastName: string): string =>
  lastName && firstName ? `${firstName} ${lastName}` : lastName || firstName;
