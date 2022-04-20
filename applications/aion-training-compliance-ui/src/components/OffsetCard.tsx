import * as React from 'react';
import { styles } from './InfoCard';
import { withStyles, WithStyles } from '@material-ui/core/styles';

type OwnProps = {
  secondaryTitle?: boolean;
  subtitle?: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps;

const OffsetCardComponent: React.FC<Props> = ({ classes, secondaryTitle, subtitle }) => (
  <div
    className={
      subtitle && secondaryTitle ? classes.cardWithSecondaryTitle : subtitle ? classes.cardWithSubtitle : classes.card
    }
  />
);

export const OffsetCard = withStyles(styles)(OffsetCardComponent);
