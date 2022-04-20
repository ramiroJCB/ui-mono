import axios from 'axios';
import { employees } from '../../fixtures/employees';
import { fetchWorker } from './fetchWorker';
import { RootState } from '../combineReducers';
import { trainees } from '../../../../packages/aion-ui-core/src/fixtures/trainees';

describe('fetchWorker', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fetches the first matching worker who has been on site', async () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: {
              value: ['foo', 'bar']
            }
          })
        )
    );

    const dispatch = jest
      .fn()
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(args => expect(args).toEqual({ payload: 'foo', type: 'FETCH_WORKER_SUCCESS' }));

    await fetchWorker('', '', '')(dispatch, () => ({} as RootState), null);
  });

  it('creates a worker who has not been on site', async () => {
    axios.get = jest.fn(
      url =>
        new Promise(resolve =>
          resolve({
            data: {
              '/api/v2/organizations()/sites()/workers': { value: [] },
              [`/spapi/employees/${employees[0].id}`]: {
                organizationId: employees[0].organizationId,
                trainee: trainees[0],
                organization: employees[0].organization
              }
            }[url]
          })
        )
    );

    const dispatch = jest
      .fn()
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(args => {
        expect(args.type).toBe('FETCH_WORKER_SUCCESS');
        expect(args.payload.employeeId).toBe(employees[0].id);
      });

    await fetchWorker('', '', employees[0].id)(dispatch, () => ({} as RootState), null);
  });
});
