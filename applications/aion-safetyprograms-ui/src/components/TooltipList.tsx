import * as React from 'react';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  items: {
    id: string;
    name: string;
  }[];
};

const styles = {
  ul: {
    margin: 0,
    padding: '8px 8px 8px 16px'
  },
  div: {
    display: 'inline-block'
  }
};

type Props = WithStyles<typeof styles> & OwnProps & Omit<TooltipProps, 'title'>;

const limit = 10;

const Component: React.FC<Props> = ({ items, children, classes, ref, ...props }) => {
  const remainder = items.length - limit;
  const { t } = useTranslation();

  return (
    <Tooltip
      title={
        <ul className={classes.ul}>
          {items.slice(0, limit).map(({ id, name }) => (
            <li key={id}>{name}</li>
          ))}
          {remainder > 0 && (
            <li>
              {t('safetyPrograms.tooltipList.items', {
                items: localizeNumber(remainder, t),
                defaultValue: 'And {{items}} more…'
              })}
            </li>
          )}
        </ul>
      }
      {...props}
    >
      <div className={classes.div} {...props}>
        {children}
      </div>
    </Tooltip>
  );
};

export const TooltipList = withStyles(styles)(Component);
