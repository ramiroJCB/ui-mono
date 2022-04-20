import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import { businessUnits } from '../../../../../fixtures';
import { cleanup, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';
import { initialState } from '../slice';
import { renderWithProviders, screen } from '../../../../common/utils/test-utils';
import { SelectBusinessUnits } from '../SelectBusinessUnits';

const axiosMock = new MockAdapter(axios);
const axiosSpy = jest.spyOn(axios, 'get');
const SetupForm: React.FC = () => (
  <Form onSubmit={jest.fn()}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit} noValidate>
        <SelectBusinessUnits contractorId="" />
      </form>
    )}
  </Form>
);

describe('business units select', () => {
  beforeEach(() => {
    axiosMock.reset();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('auto selects none if no business units are found', async () => {
    axiosMock.onGet('/api/v3.01/businessUnits').reply(200, { '@odata.count': 0, value: [] });

    renderWithProviders(<SetupForm />, { initialState: { businessUnits: initialState } });

    await waitFor(() => expect(axiosSpy).toHaveBeenCalledTimes(1));

    const input = screen.getByTestId('businessUnitId') as HTMLInputElement;

    expect(input.value).toEqual('none');
  });

  it('auto selects the first business unit if only one is found', async () => {
    axiosMock.onGet('/api/v3.01/businessUnits').reply(200, {
      '@odata.count': 1,
      value: [{ ...businessUnits[0], businessUnitId: '35e916d8-447b-447c-9a71-04ad8c6ab91d' }]
    });

    renderWithProviders(<SetupForm />, { initialState: { businessUnits: initialState } });

    await waitFor(() => expect(axiosSpy).toHaveBeenCalledTimes(1));

    const input = screen.getByTestId('businessUnitId') as HTMLInputElement;

    expect(input.value).toEqual('35e916d8-447b-447c-9a71-04ad8c6ab91d');
  });

  it('does not select any when multiple business units are found', async () => {
    axiosMock
      .onGet('/api/v3.01/businessUnits')
      .reply(200, { '@odata.count': businessUnits.length, value: businessUnits });

    renderWithProviders(<SetupForm />, { initialState: { businessUnits: initialState } });

    await waitFor(() => expect(axiosSpy).toHaveBeenCalledTimes(1));

    const input = screen.getByTestId('businessUnitId') as HTMLInputElement;

    expect(input.value).toEqual('');
  });
});
