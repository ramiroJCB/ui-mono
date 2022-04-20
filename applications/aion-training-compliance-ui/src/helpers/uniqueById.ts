type Value = {
  id: string;
};

export const uniqueById = <T extends Value>(currentValues: ReadonlyArray<T>, payload: T[]) => {
  const combined = currentValues.concat(payload);
  return Array.from(new Set(combined.map(c => c.id))).map(id => combined.find(c => c.id === id)) as T[];
};
