export const updateGracePeriodPrompted = (payload: boolean) =>
  ({
    type: 'UPDATE_GRACE_PERIOD_PROMPTED',
    payload
  } as const);

export type Actions = ReturnType<typeof updateGracePeriodPrompted>;
