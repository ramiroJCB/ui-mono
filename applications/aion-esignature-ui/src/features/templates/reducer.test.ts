import { AxiosError } from 'axios';
import { initialState, reducer, State as TemplatesState } from './reducer';
import { ITemplate, TemplateOwnerType } from 'interfaces/template';

const { Organization } = TemplateOwnerType;

let prevState: TemplatesState;

beforeEach(() => {
  prevState = initialState;
});

describe('Templates reducer', () => {
  it('updates state correctly when dispatching FETCH_TEMPLATES_REQUEST', () => {
    const nextState = reducer(prevState, {
      type: 'FETCH_TEMPLATES_REQUEST'
    });

    expect(prevState.isFetching).toBeFalsy();
    expect(nextState.isFetching).toBeTruthy();
  });

  it('updates state correctly when dispatching FETCH_TEMPLATES_SUCCESS', () => {
    const template: ITemplate = {
      id: 'c15e5d80-0c3d-42de-ae1b-496348f2dac4',
      name: 'Test template',
      externalTemplateId: 'e3cfc508-4f3b-4c45-bd33-b537a4aca032',
      ownerType: Organization,
      ownerTypeId: '7dc7a948-b60c-4bca-8c5b-f86241146372',
      createdBy: 'testuser',
      createDateUtc: '2019-03-22T03:00:00Z'
    };

    const totalCount = 10;

    const nextState = reducer(prevState, {
      type: 'FETCH_TEMPLATES_SUCCESS',
      payload: [template],
      totalCount
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toBeNull();
    expect(prevState.templates).not.toContain(template);
    expect(nextState.templates).toContain(template);
    expect(prevState.totalCount).toEqual(initialState.totalCount);
    expect(nextState.totalCount).toEqual(totalCount);
  });

  it('updates state correctly when dispatching FETCH_TEMPLATES_FAILURE', () => {
    const error: AxiosError = {
      name: 'Test Error',
      config: {},
      message: 'An error occurred during testing'
    };

    const nextState = reducer(prevState, {
      type: 'FETCH_TEMPLATES_FAILURE',
      error
    });

    expect(nextState.isFetching).toBeFalsy();
    expect(nextState.error).toEqual(error);
  });
});
