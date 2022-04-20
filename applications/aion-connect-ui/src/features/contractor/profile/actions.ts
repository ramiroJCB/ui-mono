export const toggleViewAsClient = () =>
  ({
    type: 'TOGGLE_VIEW_AS_CLIENT'
  } as const);

export const setViewAsClient = () =>
  ({
    type: 'VIEW_AS_CLIENT'
  } as const);

export type Actions = ReturnType<typeof toggleViewAsClient> | ReturnType<typeof setViewAsClient>;
