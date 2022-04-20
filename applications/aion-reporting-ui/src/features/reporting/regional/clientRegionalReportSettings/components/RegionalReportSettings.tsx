import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import { AxiosError } from 'axios';
import { BackTitleHeader } from '@pec/aion-ui-components/components/BackTitleHeader';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Grid, ListItem } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IRegionalReportOption, RegionalReportOptionKey } from 'interfaces/regionalReportOption';
import { IRegionalReportSetting } from 'interfaces/regionalReportSetting';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2)
    }
  });

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  organizationId: string;
  regionalReportOptions: DeepReadonly<IRegionalReportOption[]>;
  regionalReportSettings: DeepReadonly<IRegionalReportSetting[]>;
  toggleRegionalReportSetting: (
    optionKey: RegionalReportOptionKey
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type Props = WithStyles<typeof styles> & OwnProps;

const RegionalReportSettings: React.FC<Props> = ({
  classes,
  error,
  isFetching,
  organizationId,
  regionalReportOptions,
  regionalReportSettings,
  toggleRegionalReportSetting
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <GridContainer style={{ flexGrow: 0 }}>
        <Grid item xs={12}>
          <BackTitleHeader
            to={`/${organizationId}/reporting/regional`}
            linkTitle={t(
              'reporting.regional.clientRegionalReportSettings.backToFlexTrackReports',
              'Back to FlexTrack Reports'
            )}
          >
            {t('reporting.regional.clientRegionalReportSettings.flexTrackSettings', 'FlexTrack Settings')}
          </BackTitleHeader>
        </Grid>
      </GridContainer>
      <GridContainer>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <GridContainer>
              <Grid item xs={12}>
                {error ? (
                  <Error />
                ) : isFetching ? (
                  <Loading />
                ) : (
                  <List>
                    {regionalReportOptions.map(option => {
                      const currentSetting = regionalReportSettings.find(
                        setting => setting.regionalReportOptionKey === option.key
                      );
                      const currentValue = (currentSetting && currentSetting.value) || 'false';

                      return (
                        <ListItem key={option.key}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={currentValue === 'true'}
                                value={currentValue}
                                onChange={toggleRegionalReportSetting(option.key)}
                              />
                            }
                            label={option.displayName}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </Grid>
            </GridContainer>
          </Paper>
        </Grid>
      </GridContainer>
    </React.Fragment>
  );
};

export const RegionalReportSettingsComponent = withStyles(styles)(RegionalReportSettings);
