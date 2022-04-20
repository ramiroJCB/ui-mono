export const selectTag = (tagName: string) =>
  ({
    type: 'SELECTED_TAG',
    payload: tagName
  } as const);

export const clearTag = () =>
  ({
    type: 'CLEAR_TAG'
  } as const);

export type Actions = ReturnType<typeof selectTag> | ReturnType<typeof clearTag>;
