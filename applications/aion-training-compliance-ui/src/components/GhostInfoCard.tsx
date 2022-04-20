import * as React from 'react';
import Card from '@material-ui/core/Card';
import { styles } from './InfoCard';
import { withStyles, WithStyles } from '@material-ui/core/styles';

type OwnProps = {
  subtitle?: boolean;
  secondaryTitle?: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps;

const GhostInfoCardComponent: React.FC<Props> = ({ classes, subtitle, secondaryTitle }) => (
  <Card
    className={secondaryTitle ? classes.cardWithSecondaryTitle : subtitle ? classes.cardWithSubtitle : classes.card}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 242 40"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinejoin: 'round',
        strokeMiterlimit: 1.41421
      }}
    >
      <g opacity="0.341">
        <rect
          x="15"
          y={subtitle && secondaryTitle ? '-12' : subtitle ? '-8' : '0'}
          width="100"
          height="10"
          style={{ fillOpacity: 0.1 }}
        />
        <rect
          x="15"
          y={subtitle && secondaryTitle ? '8' : subtitle ? '16' : '24'}
          width="120"
          height="10"
          style={{ fillOpacity: 0.08 }}
        />
        {subtitle && secondaryTitle && <rect x="15" y="28" width="145" height="10" style={{ fillOpacity: 0.06 }} />}
        {subtitle && (
          <rect x="15" y={secondaryTitle ? '48' : '38'} width="160" height="10" style={{ fillOpacity: 0.06 }} />
        )}
      </g>
    </svg>
  </Card>
);

export const GhostInfoCard = withStyles(styles)(GhostInfoCardComponent);
