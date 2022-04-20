import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import { fetchTrainees } from './fetchTrainees';
import { RootState } from '../reducers';
import { SubmissionError } from 'redux-form';

const { trainees } = fixtures;

describe('fetchTrainees', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('starts registering a user if one unregistered id is found', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: trainees
          })
        )
    );

    await fetchTrainees('', history)(() => ({}), () => ({} as RootState), null);
    expect(history.push).toHaveBeenCalledWith('/trainees/362b983e-b197-4731-b582-b72158fcd918', {
      state: { hasMultipleResults: false }
    });
  });

  it('allows selecting from multiple unregistered ids', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: [trainees[0], trainees[0]]
          })
        )
    );

    await fetchTrainees('', history)(() => ({}), () => ({} as RootState), null);
    expect(history.push).toHaveBeenCalledWith({
      state: { hasMultipleResults: true }
    });
  });

  it('starts creating a new trainee if all user ids are registered', async () => {
    const history = createMemoryHistory();
    history.push = jest.fn();

    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: trainees.slice(1)
          })
        )
    );

    await fetchTrainees('', history)(() => ({}), () => ({} as RootState), null);
    expect(history.push).toHaveBeenCalledWith('/using-a-company');
  });

  it('rejects with an error message if no trainees were found', async done => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: []
          })
        )
    );
    axios.post = jest.fn();

    try {
      await fetchTrainees('who?', createMemoryHistory())(() => ({}), () => ({} as RootState), null);
    } catch (e) {
      expect(e).toBeInstanceOf(SubmissionError);
      done();
    }
  });
});
