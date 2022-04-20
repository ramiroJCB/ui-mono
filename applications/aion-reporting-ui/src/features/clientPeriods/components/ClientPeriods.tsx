import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { DeepReadonly } from 'utility-types';
import { getDisplayName } from 'helpers';
import { IClientPeriod } from 'interfaces/clientPeriod';
import { Popover } from '@pec/aion-ui-core/components/Popover';
import { useTranslation } from 'react-i18next';

type Props = {
  selectedClientPeriod: IClientPeriod;
  clientPeriods: DeepReadonly<IClientPeriod[]>;
  handleMenuItemClick: (periodId: string) => () => void;
};

export const ClientPeriodsComponent: React.FC<Props> = ({
  selectedClientPeriod: { startDate, duration },
  clientPeriods,
  handleMenuItemClick
}) => {
  const { t } = useTranslation();

  return (
    <Popover
      id="client-periods"
      render={({ buttonProps, menuProps }) => (
        <React.Fragment>
          <Button {...buttonProps} variant="outlined">
            {getDisplayName(startDate, duration, t)}
          </Button>
          <Menu {...menuProps}>
            {clientPeriods.map(p => (
              <MenuItem key={p.id} onClick={handleMenuItemClick(p.id)}>
                {getDisplayName(p.startDate, p.duration, t)}
              </MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      )}
    />
  );
};
