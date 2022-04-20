import * as React from 'react';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles, withTheme, WithTheme } from '@material-ui/core/styles';
import { getPredictiveRankingScoreColor, getPredictiveRankingScoreString } from 'helpers/helpers';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    chip: {
      color: theme.palette.common.white,
      fontWeight: 'bold',
      marginRight: theme.spacing(3)
    },
    panelSummary: {
      borderBottom: `1px solid ${theme.palette.divider}`
    }
  });

type OwnProps = {
  score?: number;
};

type Props = WithTheme & WithStyles<typeof styles> & OwnProps;

const PredictiveRankingSummary: React.FC<Props> = ({ classes, score, theme }) => {
  const { t } = useTranslation();

  return (
    <GridContainer spacing={0} justify="space-between">
      <Grid item>
        <Typography variant="h6">
          {t('subscriber.dashboard.predictiveRanking.title', 'Your PEC Predictive Ranking')}
        </Typography>
      </Grid>
      <Grid item>
        {score ? (
          <Chip
            label={getPredictiveRankingScoreString(score)}
            style={{
              backgroundColor: getPredictiveRankingScoreColor(theme, score)
            }}
            className={classes.chip}
          />
        ) : (
          <Chip
            label={t('subscriber.dashboard.predictiveRanking.noDataAvailable', 'No Data Available')}
            style={{
              backgroundColor: theme.palette.grey[500]
            }}
            className={classes.chip}
          />
        )}
      </Grid>
    </GridContainer>
  );
};

export const PredictiveRankingSummaryComponent = withTheme(withStyles(styles)(PredictiveRankingSummary));
