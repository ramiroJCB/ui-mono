type ArrayMap = { [key: string]: string[] };

const stringifyArray = (array?: string[] | null) => array && array.sort((a, b) => a.localeCompare(b)).toString();

const stringifyArrayMap = (arrayMap?: ArrayMap | null) => arrayMap && stringifyArray(Object.values(arrayMap).flat());

export const arrayIsEqual = (a?: string[] | null, b?: string[] | null) => stringifyArray(a) === stringifyArray(b);

export const arrayMapIsEqual = (a?: ArrayMap | null, b?: ArrayMap | null) =>
  stringifyArrayMap(a) === stringifyArrayMap(b);
