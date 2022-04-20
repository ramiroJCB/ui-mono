import * as fixtures from '@pec/aion-ui-core/fixtures';
import axios from 'axios';
import { ADD_TRAINEE_REQUEST, UPDATE_TRAINEE_REQUEST } from '../reducers/trainee';
import { createMemoryHistory } from 'history';
import { RootState } from '../reducers';
import { searchTrainees } from './searchTrainees';

const { trainees } = fixtures;

describe('searchTrainees', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('adds a trainee if all user ids are registered', () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: trainees.slice(1)
          })
        )
    );

    const dispatch = jest
      .fn()
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(
        async args =>
          await args(
            dispatch,
            () =>
              ({
                userInfo: { userInfo: {} }
              } as RootState),
            null
          )
      )
      .mockImplementationOnce(args => {
        expect(args.type).toBe(ADD_TRAINEE_REQUEST);
      });

    searchTrainees({ organizationId: '62511576-6342-4026-88ee-f5b5fba97f5b' }, createMemoryHistory())(
      dispatch,
      () => ({} as RootState),
      null
    );
  });

  it('updates a trainee if one unregistered user id is found', () => {
    axios.get = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: trainees
          })
        )
    );
    axios.put = jest.fn(
      () =>
        new Promise(resolve =>
          resolve({
            data: {}
          })
        )
    );
    window.location.assign = jest.fn();

    const dispatch = jest
      .fn()
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(args => args)
      .mockImplementationOnce(
        async args =>
          await args(
            dispatch,
            () =>
              ({
                userInfo: { userInfo: {} }
              } as RootState),
            null
          )
      )
      .mockImplementationOnce(args => {
        expect(args.type).toBe(UPDATE_TRAINEE_REQUEST);
      });

    searchTrainees({ organizationId: '62511576-6342-4026-88ee-f5b5fba97f5b' }, createMemoryHistory())(
      dispatch,
      () => ({} as RootState),
      null
    );
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

    await searchTrainees(
      {
        organizationId: '62511576-6342-4026-88ee-f5b5fba97f5b'
      },
      history
    )(() => ({}), () => ({} as RootState), null);
    expect(history.push).toHaveBeenCalledWith({
      state: { hasMultipleResults: true }
    });
  });

  it('allows selecting from multiple unregistered ids if no company was selected', async () => {
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

    await searchTrainees({}, history)(() => ({}), () => ({} as RootState), null);
    expect(history.push).toHaveBeenCalledWith({
      state: { hasMultipleResults: true }
    });
  });
});
