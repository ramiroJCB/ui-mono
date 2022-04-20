import * as React from 'react';
import createMemoryHistory from 'history/createMemoryHistory';
import {
  clients,
  contractorPeriods,
  contractors,
  operationalMetrics,
  operationalMetricValues
} from '../../../../../../fixtures';
import { ContractorOperationsForm } from './ContractorOperationsForm';
import { ContractorOperationsTableComponent } from '../components/ContractorOperationsTable';
import { DisplayPeriodStatus } from 'interfaces/contractorPeriod';
import { FakeStoreAndRouter } from '@pec/aion-ui-core/components/FakeStoreAndRouter';
import { mapOperationalMetrics } from '../helpers';
import { mount } from 'enzyme';
import '@pec/aion-ui-i18next';

const { Waiting } = DisplayPeriodStatus;

describe('Contractor Operations Form', () => {
  const contractorId = contractors[0].id;
  const clientId = clients[0].id;
  const clientName = clients[0].name;
  const periodId = contractorPeriods[0].id;
  const metrics = operationalMetrics.value;
  const onSubmitMetricValue = jest.fn();
  const onSubmit = jest.fn();

  const mappedOperationalMetrics =
    operationalMetrics && operationalMetricValues ? mapOperationalMetrics(metrics, operationalMetricValues.value) : [];

  it('renders the Contractor Operations Reporting page with the form', () => {
    const wrapper = mount(
      <FakeStoreAndRouter
        state={{
          form: { contractorOperationsForm: { values: {} } },
          operationalContractorPeriods: {
            isFetching: false,
            error: null,
            periods: contractorPeriods
          }
        }}
      >
        <ContractorOperationsForm
          history={createMemoryHistory()}
          organizationId={contractorId}
          clientId={clientId}
          clientName={clientName}
          periodId={periodId}
          operationalMetrics={metrics}
          mappedMetrics={mappedOperationalMetrics}
          isFetching={false}
          onSubmitMetricValue={onSubmitMetricValue}
          onSubmit={onSubmit}
          initialValues={{ status: Waiting }}
        />
      </FakeStoreAndRouter>
    );

    expect(wrapper.find('h2').text()).toMatch(`Operations Reporting for ${clientName}`);
    expect(wrapper.find(ContractorOperationsTableComponent)).toHaveLength(1);
  });
});
