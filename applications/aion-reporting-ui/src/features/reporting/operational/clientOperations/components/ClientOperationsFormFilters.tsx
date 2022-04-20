import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Autocomplete, OwnProps as FieldArrayCustomProps } from '@pec/aion-ui-deprecated/components/Autocomplete';
import { AutocompleteContractorsContainer } from 'features/autocompleteContractors/containers/AutocompleteContractors';
import { AutocompleteDialog } from '@pec/aion-ui-deprecated/components/Autocomplete/Dialog';
import { DeepReadonly } from 'utility-types';
import { FieldArray, GenericFieldArray } from 'redux-form';
import { filterByName } from '@pec/aion-ui-core/helpers/autocomplete';
import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';
import { IOperationalMetric } from 'interfaces/operationalMetric';
import { IPeriodStatus } from 'interfaces/periodStatus';
import { ReportType } from 'features/redirect/enums/reportType';
import { TextFieldProps } from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  periodId: string;
  operationalMetrics: DeepReadonly<IOperationalMetric[]> | null;
  periodStatuses: IPeriodStatus[];
  selectedContractorsLength: number;
  selectedOperationalMetricsLength: number;
  selectedPeriodStatusesLength: number;
};

const FieldArrayCustom = FieldArray as new () => GenericFieldArray<
  IAutocompleteOption,
  FieldArrayCustomProps & Omit<TextFieldProps, 'component' | 'classes'>
>;

export const ClientOperationsFormFiltersComponent: React.FC<Props> = ({
  organizationId,
  periodId,
  operationalMetrics,
  periodStatuses,
  selectedContractorsLength,
  selectedOperationalMetricsLength,
  selectedPeriodStatusesLength
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid item>
        <AutocompleteDialog
          buttonText={
            selectedContractorsLength === 0
              ? t('reporting.common.allContractors', 'All Contractors')
              : t('reporting.common.contractorsCount', {
                  count: selectedContractorsLength,
                  defaultValue_plural: '{{count}} Contractors',
                  defaultValue: '{{count}} Contractor'
                })
          }
        >
          <AutocompleteContractorsContainer
            organizationId={organizationId}
            periodId={periodId}
            reportType={ReportType.Operations}
          />
        </AutocompleteDialog>
      </Grid>
      {operationalMetrics && (
        <Grid item>
          <AutocompleteDialog
            buttonText={
              selectedOperationalMetricsLength === 0
                ? t('reporting.operational.clientOperations.allMetrics', 'All Metrics')
                : t('reporting.operational.clientOperations.metricsCount', {
                    count: selectedOperationalMetricsLength,
                    defaultValue_plural: '{{count}} Metrics',
                    defaultValue: '{{count}} Metric'
                  })
            }
          >
            <FieldArrayCustom
              name="operationalMetrics"
              props={{
                autoFocus: true,
                label: t('reporting.operational.clientOperations.metrics', 'Metrics'),
                options: operationalMetrics,
                placeholder: t('reporting.operational.clientOperations.enterMetricName', 'Enter a Metric Name…'),
                filter: filterByName
              }}
              component={Autocomplete}
            />
          </AutocompleteDialog>
        </Grid>
      )}
      <Grid item>
        <AutocompleteDialog
          buttonText={
            selectedPeriodStatusesLength === 0
              ? t('reporting.operational.clientOperations.allPeriodStatuses', 'All Statuses')
              : t('reporting.operational.clientOperations.periodStatusesCount', {
                  count: selectedPeriodStatusesLength,
                  defaultValue_plural: '{{count}} Statuses',
                  defaultValue: '{{count}} Status'
                })
          }
        >
          <FieldArrayCustom
            name="periodStatuses"
            props={{
              autoFocus: true,
              label: t('reporting.operational.clientOperations.statuses', 'Statuses'),
              options: periodStatuses,
              placeholder: t('reporting.operational.clientOperations.enterStatusName', 'Enter a Status Name…'),
              filter: filterByName
            }}
            component={Autocomplete}
          />
        </AutocompleteDialog>
      </Grid>
    </React.Fragment>
  );
};
