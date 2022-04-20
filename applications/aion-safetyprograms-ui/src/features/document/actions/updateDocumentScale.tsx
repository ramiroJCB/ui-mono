export const updateDocumentScale = (scale: number) =>
  ({
    type: 'UPDATE_DOCUMENT_SCALE',
    scale
  } as const);

export type Actions = ReturnType<typeof updateDocumentScale>;
