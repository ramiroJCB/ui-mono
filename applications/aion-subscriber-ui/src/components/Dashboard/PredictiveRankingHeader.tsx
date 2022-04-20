import * as React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles, withTheme, WithTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    headingCell: {
      borderBottom: 'none',
      width: '50%'
    },
    headingText: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary
    }
  });

type Props = WithTheme & WithStyles<typeof styles>;

const PredictiveRankingHeader: React.FC<Props> = ({ classes }) => {
  const { t } = useTranslation();

  return (
    <TableHead>
      <TableRow>
        <TableCell className={classes.headingCell}>
          <Typography variant="body2" className={classes.headingText}>
            {t('subscriber.dashboard.predictiveRanking.contributingFactors', 'Contributing Factors')}
          </Typography>
        </TableCell>
        <TableCell className={classes.headingCell}>
          <Typography variant="body2" className={classes.headingText}>
            {t('subscriber.dashboard.predictiveRanking.details', 'Details')}
          </Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export const PredictiveRankingHeaderComponent = withTheme(withStyles(styles)(PredictiveRankingHeader));
