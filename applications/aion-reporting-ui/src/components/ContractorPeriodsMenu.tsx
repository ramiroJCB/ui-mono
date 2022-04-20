import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { DeepReadonly } from 'utility-types';
import { getDisplayName, getStatus } from 'helpers';
import { History } from 'history';
import { IContractorPeriod } from 'interfaces/contractorPeriod';
import { PeriodIconComponent } from './PeriodIcon';
import { Popover } from '@pec/aion-ui-core/components/Popover';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

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
  getPeriodDisplayName = (period: IContractorPeriod) => {
    const {
      startDate,
      duration,
      endDate,
      gracePeriodMillis,
      reportStatus: metricStatus,
      reportStatusUpdatedDateUtc: metricStatusUpdatedDateUtc
    } = period;
    const name = getDisplayName(startDate, duration, this.props.t);
    const status = getStatus(endDate, gracePeriodMillis, metricStatus, metricStatusUpdatedDateUtc);

    return (
      <React.Fragment>
        <PeriodIconComponent status={status} /> {name}
      </React.Fragment>
    );
  };
  render() {
    const { selectedPeriod, periods, handleMenuItemClick } = this.props;

    return (
      <Popover
        id="contractor-periods"
        render={({ buttonProps, menuProps }) => (
          <React.Fragment>
            <Button {...buttonProps} variant="outlined">
              {this.getPeriodDisplayName(selectedPeriod)}
            </Button>
            <Menu {...menuProps} onClick={menuProps.onClose}>
              {periods.map(period => (
                <MenuItem key={period.id} onClick={handleMenuItemClick(period.periodId)}>
                  {this.getPeriodDisplayName(period)}
                </MenuItem>
              ))}
            </Menu>
          </React.Fragment>
        )}
      />
    );
  }
}

export const ContractorPeriodsMenuComponent = withTranslation()(Component);
