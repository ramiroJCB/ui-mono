import { announcements, error } from '../../../../fixtures';
import { initialState, reducer, State } from './reducer';

let prevState: State;
const announcement = announcements[0];

beforeEach(() => {
  prevState = initialState;
});

describe('announcement reducer', () => {
  it('should update state correctly when dispatching FETCH_ANNOUNCEMENT_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ANNOUNCEMENT_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('should update state correctly when dispatching ADD_ANNOUNCEMENT_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_ANNOUNCEMENT_SUCCESS',
      payload: announcement
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.announcement).toEqual(announcement);
  });

  it('should update state correctly when dispatching EDIT_ANNOUNCEMENT_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_ANNOUNCEMENT_SUCCESS',
      payload: announcement
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.announcement).toEqual(announcement);
  });

  it('should update state correctly when dispatching FETCH_ANNOUNCEMENT_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ANNOUNCEMENT_SUCCESS',
      payload: announcement
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.announcement).toEqual(announcement);
  });

  it('should update state correctly when dispatching DELETE_ANNOUNCEMENT_SUCCESS', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_ANNOUNCEMENT_SUCCESS'
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(nextState.announcement).toBeNull();
  });

  it('should update state correctly when dispatching ADD_ANNOUNCEMENT_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'ADD_ANNOUNCEMENT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching EDIT_ANNOUNCEMENT_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'EDIT_ANNOUNCEMENT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching DELETE_ANNOUNCEMENT_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'DELETE_ANNOUNCEMENT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });

  it('should update state correctly when dispatching FETCH_ANNOUNCEMENT_FAILURE', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_ANNOUNCEMENT_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
