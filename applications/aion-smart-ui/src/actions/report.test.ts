import axios, { AxiosResponse } from 'axios';
import { fetchReport } from './report';
import { RootState } from '../reducers';

const organizationId = 'cf3b9cf1-b119-47b9-917f-b3b431b7acae';
const start = '2018-11-01T00:00:00.000Z';
const end = '2018-11-10T15:19:04.662Z';
const tags = ['foo', 'Bar', 'BAZ'];

describe('fetchReport', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('sends params for the first page of results', () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: {}, headers: {} })));

    fetchReport(organizationId, {
      page: '1',
      start,
      end,
      tags: tags[0]
    })(() => null, () => ({} as RootState), null);

    expect(axios.get).toHaveBeenCalledWith(
      '/api/v2/organizations(cf3b9cf1-b119-47b9-917f-b3b431b7acae)/workerDetails',
      {
        params: {
          $filter: `(dateTimeIn ge 2018-11-01T00:00:00.000Z and dateTimeOut le 2018-11-10T15:19:04.662Z) and (contains(tolower(siteTags),'foo'))`,
          $skip: 0,
          $top: 100,
          _limit: 100,
          _page: '1'
        }
      }
    );
  });

  it('sends params for the second page of results', () => {
    axios.get = jest.fn(() => new Promise(resolve => resolve({ data: {}, headers: {} })));

    fetchReport(organizationId, {
      page: '2',
      start,
      end,
      tags: tags[0]
    })(() => null, () => ({} as RootState), null);

    expect(axios.get).toHaveBeenCalledWith(
      '/api/v2/organizations(cf3b9cf1-b119-47b9-917f-b3b431b7acae)/workerDetails',
      {
        params: {
          $filter: `(dateTimeIn ge 2018-11-01T00:00:00.000Z and dateTimeOut le 2018-11-10T15:19:04.662Z) and (contains(tolower(siteTags),'foo'))`,
          $skip: 100,
          $top: 100,
          _limit: 100,
          _page: '2'
        }
      }
    );
  });

  it('succeeds with a real OData payload', () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: {
              '@odata.count': 1337,
              value: ['stuff']
            },
            headers: {}
          } as AxiosResponse)
        )
    );

    const dispatch = jest
      .fn()
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(args => {
        expect(args).toEqual({
          type: 'FETCH_REPORT_SUCCESS',
          payload: ['stuff'],
          totalCount: 1337
        });
      });

    fetchReport(organizationId, {
      page: '2',
      start,
      end,
      tags: tags[0]
    })(dispatch, () => ({} as RootState), null);
  });

  it('succeeds with a json-server payload', () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: ['stuff'],
            headers: {
              'x-total-count': '1337'
            }
          } as AxiosResponse)
        )
    );

    const dispatch = jest
      .fn()
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(args => {
        expect(args).toEqual({
          type: 'FETCH_REPORT_SUCCESS',
          payload: ['stuff'],
          totalCount: 1337
        });
      });

    fetchReport(organizationId, {
      page: '2',
      start,
      end,
      tags: tags[0]
    })(dispatch, () => ({} as RootState), null);
  });
});
