import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import {
  cleanup,
  createMatchMedia,
  getActionResult,
  renderWithProviders,
  screen,
  waitForElementToBeRemoved
} from '../../../../common/utils/test-utils';
import { fetchInspections, initialState } from '../../../inspections/slice';
import { IInspection } from '../../../../interfaces/inspection';
import { inspections } from '../../../../../fixtures';
import { ViewContractorInspections } from '../ViewInspections';

const axiosMock = new MockAdapter(axios);

describe('view contractor inspections', () => {
  beforeEach(() => {
    axiosMock.reset();
    axiosMock
      .onGet('/api/inspections/v3.01/inspections')
      .reply(200, { '@odata.count': inspections.length, value: inspections });
  });

  afterEach(cleanup);

  describe('screens < 600px wide', () => {
    it('shows a loading spinner, followed by a virtualized grid on smaller screens', async () => {
      window.matchMedia = createMatchMedia(600);

      const { store } = renderWithProviders(<ViewContractorInspections />, {
        initialState: { inspections: initialState }
      });

      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

      expect(screen.queryAllByText('ReactVirtualized__Grid')).toBeDefined();

      const { type } = await getActionResult<IInspection[]>(store.dispatch);
      expect(type).toEqual(fetchInspections.fulfilled.type);
    });
  });

  describe('screens > 1280px wide', () => {
    it('shows a loading spinner, followed by a table of inspections', async () => {
      window.matchMedia = createMatchMedia(1920);

      const { store } = renderWithProviders(<ViewContractorInspections />, {
        initialState: { inspections: initialState }
      });

      await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

      expect(screen.getByTestId('table')).toBeInTheDocument();
      expect(screen.getAllByText(inspections[0].formName)).toHaveLength(5);

      const { type } = await getActionResult<IInspection[]>(store.dispatch);
      expect(type).toEqual(fetchInspections.fulfilled.type);
    });
  });
});
