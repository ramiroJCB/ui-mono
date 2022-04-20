import { calcuteCardRows, calcuteTopAndSkip } from './infiniteCardGrid';

describe('calcuteCardRows', () => {
  it('gets the correct items per row and row count depending on common screen resolutions', () => {
    const cardSize = 350;
    const totalCount = 1000;

    expect(calcuteCardRows(2213, cardSize, totalCount)).toEqual({ itemsPerRow: 6, rowCount: 167 }); // 2560 x 1440
    expect(calcuteCardRows(1575, cardSize, totalCount)).toEqual({ itemsPerRow: 4, rowCount: 250 }); // 1920 x 1080
    expect(calcuteCardRows(1036, cardSize, totalCount)).toEqual({ itemsPerRow: 2, rowCount: 500 }); // 1366 x 768
    expect(calcuteCardRows(694, cardSize, totalCount)).toEqual({ itemsPerRow: 1, rowCount: 1000 }); // 1024 x 786
  });
});

describe('calcuteTopAndSkip', () => {
  it('makes sure top is never zero', () => {
    expect(calcuteTopAndSkip(1, 0, 0)).toEqual({ skip: 0, top: 1 });
  });

  it('makes sure top is never more than 100', () => {
    expect(calcuteTopAndSkip(4, 0, 26)).toEqual({ skip: 0, top: 100 });
  });

  it('skips the correct amount based on items per row', () => {
    expect(calcuteTopAndSkip(4, 0, 19)).toEqual({ skip: 0, top: 76 });
    expect(calcuteTopAndSkip(4, 19, 25)).toEqual({ skip: 76, top: 24 });
  });
});
