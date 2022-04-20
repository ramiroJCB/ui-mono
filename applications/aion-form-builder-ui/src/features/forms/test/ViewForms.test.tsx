import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import {
  cleanup,
  getActionResult,
  renderWithProviders,
  screen,
  waitForElementToBeRemoved
} from '../../../utils/test-utils';
import { fetchForms, initialState } from '../slice';
import { IForm } from 'interfaces/form';
import { ViewForms } from '../ViewForms';

const axiosMock = new MockAdapter(axios);

describe('view forms', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  afterEach(cleanup);

  it('invites user to create a form if their organization has not yet created any', async () => {
    axiosMock.onGet('/api/v3.01/forms').reply(200, { '@odata.count': 0, value: [] });

    const instructions = 'Use the button below to add your first form.';
    const notice = 'There are currently no forms to view';

    const { store } = renderWithProviders(<ViewForms />, { initialState: { forms: initialState } });
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText('Forms')).toBeDefined();
    expect(screen.getByTestId('createFormButton')).toBeInTheDocument();
    expect(screen.getByText(instructions)).toBeDefined();
    expect(screen.getByText(notice)).toBeDefined();

    const { type } = await getActionResult<IForm[]>(store.dispatch);
    expect(type).toEqual(fetchForms.fulfilled.type);
  });
});
