import { initialState, reducer, State } from './reducer';

let prevState: State;

beforeEach(() => {
  prevState = initialState;
});

describe('toggle view as client reducer', () => {
  it('should toggle viewAsClient state when dispatching TOGGLE_VIEW_AS_CLIENT', () => {
    let nextState = reducer(prevState, {
      type: 'TOGGLE_VIEW_AS_CLIENT'
    });

    expect(prevState.viewAsClient).toBeFalsy();
    expect(nextState.viewAsClient).toBeTruthy();

    nextState = reducer(nextState, {
      type: 'TOGGLE_VIEW_AS_CLIENT'
    });

    expect(nextState.viewAsClient).toBeFalsy();
  });

  it('should toggle viewAsClient state when dispatching VIEW_AS_CLIENT', () => {
    const nextState = reducer(prevState, {
      type: 'VIEW_AS_CLIENT'
    });

    expect(prevState.viewAsClient).toBeFalsy();
    expect(nextState.viewAsClient).toBeTruthy();
  });
});
