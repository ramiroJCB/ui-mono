import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Trans, useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    },
    link: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'underline',
      display: 'inline',
      margin: 0,
      padding: 0,
      color: theme.palette.primary.light,
      '&:hover': {
        color: theme.palette.primary.main
      }
    }
  });

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  downloadStudentEmergencyContactListReport: () => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

const DownloadStudentEmergencyContactListReport: React.FC<Props> = ({
  classes,
  isFetching,
  error,
  downloadStudentEmergencyContactListReport
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <GridContainer alignItems="flex-start" justify="space-between" style={{ flex: 0 }}>
        <Grid item>
          <GridContainer spacing={0}>
            <Grid item xs={12}>
              <Typography variant="h5" component="h2">
                {t(
                  'reporting.studentEmergencyContactList.studentEmergencyContactList',
                  'Student Emergency Contact List'
                )}
              </Typography>
            </Grid>
          </GridContainer>
        </Grid>
      </GridContainer>
      <GridContainer>
        <Grid item xs={12}>
          <Paper className={classes.root} elevation={1}>
            <GridContainer justify="center">
              {!isFetching ? (
                <Grid item>
                  <Typography variant="subtitle2">
                    <Trans i18nKey="reporting.studentEmergencyContactList.yourReportStartedDownloading">
                      Your report has started downloading.{' '}
                      <button onClick={downloadStudentEmergencyContactListReport} className={classes.link}>
                        <Typography variant="subtitle2">Click here</Typography>
                      </button>{' '}
                      to download the report again.
                    </Trans>
                  </Typography>
                </Grid>
              ) : error && error.response && error.response.status === 401 ? (
                <Error
                  message={t(
                    'reporting.studentEmergencyContactList.noPermissionsToDownload',
                    'You do not have the correct permissions to download this report.'
                  )}
                />
              ) : error ? (
                <Error
                  message={
                    <React.Fragment>
                      <Trans i18nKey="reporting.studentEmergencyContactList.errorDownloadingThisFile">
                        There was an error downloading this file. Please{' '}
                        <button onClick={downloadStudentEmergencyContactListReport} className={classes.link}>
                          <Typography variant="subtitle2">click here</Typography>
                        </button>{' '}
                        to try again.
                      </Trans>
                    </React.Fragment>
                  }
                />
              ) : (
                <Loading />
              )}
            </GridContainer>
          </Paper>
        </Grid>
      </GridContainer>
    </React.Fragment>
  );
};

export const DownloadStudentEmergencyContactListReportComponent = withStyles(styles)(
  DownloadStudentEmergencyContactListReport
);
