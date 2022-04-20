import axios from 'axios';
import { createMemoryHistory } from 'history';
import { fetchTrainees } from './fetchTrainees';
import { RootState } from '../combineReducers';
import { traineesWithEmployees } from '../../fixtures/traineesWithEmployees';

describe('fetchTrainees', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('fails if no one was found by pecId', async () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: []
          })
        )
    );

    const dispatch = jest
      .fn()
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(args => expect(args.type).toBe('FETCH_TRAINEES_FAILURE'));

    try {
      await fetchTrainees('who?', createMemoryHistory())(dispatch, () => ({} as RootState), null);
    } catch (e) {
      return;
    }
  });

  it('shows a list of people who matched a pecId', async () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: traineesWithEmployees.slice(0, 3)
          })
        )
    );

    const history = createMemoryHistory();
    history.push = jest.fn();

    await fetchTrainees('', history)(() => ({}), () => ({} as RootState), null);
    expect(history.push).toHaveBeenCalledWith({ state: { showPecIdMatches: true } });
  });
});
