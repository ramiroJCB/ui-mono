import { getMimeType } from './file';

describe('file helper', () => {
  it(`getMimeType should return the correct mimeType for .xlsx files`, () => {
    const file = new File([], 'test.xlsx');

    expect(getMimeType(file)).toBe('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  });

  it(`getMimeType should return the correct mimeType for .xls files`, () => {
    const file = new File([], 'test.xls');

    expect(getMimeType(file)).toBe('application/vnd.ms-excel');
  });

  it(`getMimeType should return application/octet-stream for files not accounted for`, () => {
    const file = new File([], 'test.wow');

    expect(getMimeType(file)).toBe('application/octet-stream');
  });
});
