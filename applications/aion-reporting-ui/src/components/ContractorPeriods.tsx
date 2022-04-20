import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ContractorPeriodsMenuComponent } from './ContractorPeriodsMenu';
import { DeepReadonly } from 'utility-types';
import { FormLabel } from '@material-ui/core';
import { getDueDate, getStatus } from 'helpers';
import { History } from 'history';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { PeriodTextComponent } from './PeriodText';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  history: History;
  organizationId: string;
  clientId: string;
  selectedPeriod: IContractorPeriod;
  periods: DeepReadonly<IContractorPeriod[]>;
  handleMenuItemClick: (periodId: string) => () => void;
};

type Props = OwnProps & I18nextProps;

class Component extends React.Component<Props> {
  displayDueDate({ endDate, gracePeriodMillis }: IContractorPeriod) {
    const dueDate = getDueDate(endDate, gracePeriodMillis + 1);

    return localizeDateTime(dueDate, this.props.t);
  }

  render() {
    const { periods, selectedPeriod, organizationId, clientId, history, handleMenuItemClick, t } = this.props;
    const {
      endDate,
      gracePeriodMillis,
      reportStatus: metricStatus,
      reportStatusUpdatedDateUtc: metricStatusUpdatedDateUtc
    } = selectedPeriod;

    return (
      <Grid container alignItems="center" spacing={5}>
        <Grid item>
          <ContractorPeriodsMenuComponent
            history={history}
            organizationId={organizationId}
            clientId={clientId}
            selectedPeriod={selectedPeriod}
            periods={periods}
            handleMenuItemClick={handleMenuItemClick}
          />
        </Grid>
        <Grid item>
          <FormLabel>{t('reporting.common.status', 'Status')}</FormLabel>
          <PeriodTextComponent
            status={getStatus(endDate, gracePeriodMillis, metricStatus, metricStatusUpdatedDateUtc)}
          />
        </Grid>
        <Grid item>
          <FormLabel>{t('reporting.components.dueBefore', 'Due Before')}</FormLabel>
          <Typography variant="body1">{this.displayDueDate(selectedPeriod)}</Typography>
        </Grid>
        {selectedPeriod.reportStatusUpdatedDateUtc && (
          <Grid item>
            <FormLabel>{t('reporting.components.updatedDate', 'Updated Date')}</FormLabel>
            <Typography variant="body1">{localizeDateTime(selectedPeriod.reportStatusUpdatedDateUtc, t)}</Typography>
          </Grid>
        )}
      </Grid>
    );
  }
}

export const ContractorPeriodsComponent = withTranslation()(Component);
