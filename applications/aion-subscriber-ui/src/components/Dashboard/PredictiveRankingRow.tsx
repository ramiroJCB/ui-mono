import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles, withTheme, WithTheme } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { getPredictiveRankingScoreColor } from 'helpers/helpers';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IPredictiveRanking, IRiskDataImpact } from 'interfaces/predictiveRanking';
import { useTranslation } from 'react-i18next';

const styles = () =>
  createStyles({
    tableCell: {
      width: '50%',
      verticalAlign: 'top'
    }
  });

type OwnProps = {
  predictiveRanking?: DeepReadonly<IPredictiveRanking>;
  impact?: DeepReadonly<IRiskDataImpact>;
};

type Props = WithTheme & WithStyles<typeof styles> & OwnProps;

const PredictiveRankingRow: React.FC<Props> = ({ classes, theme, predictiveRanking, impact }) => {
  const { t } = useTranslation();

  return (
    <TableRow>
      <TableCell className={classes.tableCell}>
        <GridContainer spacing={0}>
          <Grid item xs={2} lg={1}>
            <Typography variant="body1">
              {predictiveRanking ? (
                <span
                  style={{
                    color: getPredictiveRankingScoreColor(theme, predictiveRanking.score)
                  }}
                >
                  ⬤
                </span>
              ) : (
                <span
                  style={{
                    color: theme.palette.grey[500]
                  }}
                >
                  ⬤
                </span>
              )}
            </Typography>
          </Grid>
          <Grid item xs={10} lg={11}>
            <Typography variant="body1">
              {predictiveRanking
                ? impact
                  ? impact.shortDescription
                  : t('subscriber.dashboard.predictiveRanking', 'No Contributing Factors')
                : t('subscriber.dashboard.predictiveRanking.noDataAvailable', 'No Data Available')}
            </Typography>
          </Grid>
        </GridContainer>
      </TableCell>
      <TableCell className={classes.tableCell}>
        <Typography variant="body2">
          {predictiveRanking
            ? impact
              ? impact.longDescription
              : t(
                  'subscriber.dashboard.predictiveRanking.identifiedRisks',
                  'The PEC Predictive model did not identify any significant risk over industry baseline.'
                )
            : t(
                'subscriber.dashboard.predictiveRanking.noPredictiveData',
                'No predictive data available. This may be a result of too much missing information in your questionnaire or your account is too new for a predictive ranking to exist. Please complete your questionnaire and check back later. Predictive rankings are updated in the first week of each month.'
              )}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export const PredictiveRankingRowComponent = withTheme(withStyles(styles)(PredictiveRankingRow));
