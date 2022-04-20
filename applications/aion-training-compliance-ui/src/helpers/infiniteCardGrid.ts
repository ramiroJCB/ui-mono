export const calcuteCardRows = (width: number, cardSize: number, totalCount: number) => {
  const itemsPerRow = Math.floor(width / cardSize) || 1;
  const rowCount = Math.ceil(totalCount / itemsPerRow);

  return {
    itemsPerRow,
    rowCount
  };
};

export const calcuteTopAndSkip = (itemsPerRow: number, startIndex: number, stopIndex: number) => {
  const skip = startIndex * itemsPerRow;
  let top = stopIndex * itemsPerRow - skip;

  if (top === 0) {
    top = 1;
  } else if (top > 100) {
    top = 100;
  }

  return {
    skip,
    top
  };
};
