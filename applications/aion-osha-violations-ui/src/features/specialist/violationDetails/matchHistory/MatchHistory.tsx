import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useTypedSelector } from 'app/reducer';
import { useTranslation } from 'react-i18next';
import { localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';
import { getActionLabel } from '../utils';

const useStyles = makeStyles((theme: Theme) => ({
  dates: { color: theme.palette.text.secondary },
  status: { color: theme.palette.grey[700] }
}));

export const MatchHistory: React.FC = () => {
  const classes = useStyles();
  const { matchRecords, isFetching } = useTypedSelector(state => state.violationRecords);
  const { t } = useTranslation();

  return (
    <Grid container direction="column">
      <Typography variant="h4" gutterBottom>
        {t('oshaViolations.matchHistory.matchHistory', 'Match History')}
      </Typography>
      {isFetching ? (
        <Loading />
      ) : matchRecords?.length ? (
        matchRecords.map((record, index) => (
          <Grid item key={index}>
            <Typography variant="subtitle2" className={classes.status} gutterBottom>
              {record.status === 'NoAutomaticMatch'
                ? t('oshaViolations.common.other', 'Other')
                : getActionLabel(record.status, t)}
            </Typography>
            <Typography variant="body1" gutterBottom className={classes.dates}>
              {record.userName !== 'SYSTEM' ? record.userName : t('oshaViolations.common.automatic', 'Automatic')}
              {' \u2022 '}
              {localizeDateTime(record.eventDateUtc, t)}
            </Typography>
            <Typography variant="subtitle2" paragraph gutterBottom>
              {record.reasonForAction}
            </Typography>
          </Grid>
        ))
      ) : null}
    </Grid>
  );
};
