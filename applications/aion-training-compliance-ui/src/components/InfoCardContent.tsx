import * as React from 'react';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { InfoCardIcon } from './InfoCardIcon';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

export const styles = (theme: Theme) => ({
  title: {
    fontSize: 14,
    marginLeft: theme.spacing(0.5)
  },
  secondaryTitle: {
    fontSize: 18,
    color: theme.palette.grey[600]
  },
  content: {
    flex: '1 0 auto'
  },
  contentWithMenu: {
    flex: '1 0 auto',
    paddingTop: 0
  },
  subtitleContainer: {
    display: 'flex',
    marginTop: theme.spacing(0.5)
  },
  iconContainer: {
    display: 'flex',
    fontSize: 16
  }
});

type OwnProps = {
  cardType: string;
  secondaryTitle?: string;
  name: string;
  subtitle?: string | JSX.Element;
  withMenu?: boolean;
  variant?: 'contractor' | 'workGroup' | 'customTraining' | 'standardTraining' | 'jobType' | 'employee';
};

type Props = OwnProps & WithStyles<typeof styles>;

const InfoCardContentComponent: React.FC<Props> = ({
  classes,
  cardType,
  name,
  subtitle,
  withMenu,
  variant,
  secondaryTitle
}) => (
  <CardContent className={withMenu ? classes.contentWithMenu : classes.content}>
    {!withMenu && (
      <div className={classes.iconContainer}>
        <InfoCardIcon variant={variant} />
        <Typography variant="body2" className={classes.title} color="textSecondary" gutterBottom noWrap>
          {cardType}
        </Typography>
      </div>
    )}
    <Typography variant="h6" component="h5" noWrap>
      {name}
    </Typography>
    {secondaryTitle && (
      <Typography variant="body2" className={classes.secondaryTitle} noWrap>
        {secondaryTitle}
      </Typography>
    )}
    {subtitle && <div className={classes.subtitleContainer}>{subtitle}</div>}
  </CardContent>
);

export const InfoCardContent = withStyles(styles)(InfoCardContentComponent);
