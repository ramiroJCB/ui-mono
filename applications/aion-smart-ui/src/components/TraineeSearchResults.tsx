import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { formatTraineeDisplayName } from 'helpers/formatTraineeDisplayName';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { ISearchTraineesForm } from 'interfaces/searchTraineesForm';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WorkerIcon } from './WorkerIcon';
import { useTranslation } from 'react-i18next';

type OwnProps = {
  handleItemClick: (trainee: DeepReadonly<ITraineeWithEmployees>, selectedEmployee?: number) => () => void;
  handleTraineeNotFound: (userProvidedInfo: ISearchTraineesForm) => () => void;
  organizationId: string;
  showBackButton: boolean;
  siteId: string;
  trainees: DeepReadonly<ITraineeWithEmployees[]>;
  userProvidedInfo: ISearchTraineesForm;
};

const styles = (theme: Theme) => ({
  largeAvatar: {
    width: 70,
    height: 70
  },
  workerIcon: {
    width: 50,
    height: 50
  },
  backToSearch: {
    color: theme.palette.text.primary
  },
  traineeHeaderText: {
    marginTop: theme.spacing(1)
  },
  gutters: {
    paddingLeft: 0
  },
  listItemText: {
    width: 'calc(100% - 80px)'
  }
});

type Props = WithStyles<typeof styles> & OwnProps;

const TraineeSearchResultsComponent: React.FC<Props> = ({
  organizationId,
  showBackButton,
  siteId,
  trainees,
  classes,
  handleItemClick,
  handleTraineeNotFound,
  userProvidedInfo
}) => {
  const { t } = useTranslation();
  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography className={classes.traineeHeaderText} variant="h6">
          {t('smart.traineeSearchResults.selectYourMatchingRecord', 'Select Your Matching Record')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <List component="nav">
          {trainees.map(trainee => (
            <React.Fragment key={trainee.id}>
              {trainee.employees.map((employee, employeeIndex) => (
                <IconListItem
                  key={employee.id}
                  primaryText={formatTraineeDisplayName(trainee.firstName, trainee.lastName)}
                  className={classes.largeAvatar}
                  classes={{ gutters: classes.gutters }}
                  divider
                  photoUrl={trainee.photoUrl}
                  icon={<WorkerIcon className={classes.workerIcon} />}
                  secondaryTypographyProps={{ component: 'span' }}
                  secondaryAction={
                    <Button onClick={handleItemClick(trainee, employeeIndex)} variant="contained" color="secondary">
                      {t('smart.common.select', 'Select')}
                    </Button>
                  }
                >
                  <div className={classes.listItemText}>
                    {t('smart.traineeSearchResults.employer', {
                      defaultValue: 'Employer: {{employeeOrganization}}',
                      employeeOrganization: employee.organization.name
                    })}
                  </div>
                </IconListItem>
              ))}
              <IconListItem
                primaryText={formatTraineeDisplayName(trainee.firstName, trainee.lastName)}
                className={classes.largeAvatar}
                classes={{ gutters: classes.gutters }}
                divider
                photoUrl={trainee.photoUrl}
                icon={<WorkerIcon className={classes.workerIcon} />}
                secondaryTypographyProps={{ component: 'span' }}
                secondaryAction={
                  <Button onClick={handleItemClick(trainee)} variant="contained" color="secondary">
                    {t('smart.common.select', 'Select')}
                  </Button>
                }
              >
                <div className={classes.listItemText}>
                  {t('smart.traineeSearchResults.linkThisRecord', 'Link this record with')}{' '}
                  {userProvidedInfo.organization.name}
                </div>
              </IconListItem>
            </React.Fragment>
          ))}
        </List>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="secondary" fullWidth onClick={handleTraineeNotFound(userProvidedInfo)}>
          {t('smart.traineeSearchResults.theseArentRight', 'These aren’t right - Create a New Record')}
        </Button>
      </Grid>
      {showBackButton && (
        <Grid item xs={12}>
          <Button
            variant="contained"
            className={classes.backToSearch}
            fullWidth
            component={Link}
            to={`/${organizationId}/sites/${siteId}`}
          >
            {t('smart.traineeSearchResults.backToCheckIn', 'Back to Check In Form')}
          </Button>
        </Grid>
      )}
    </GridContainer>
  );
};

export const TraineeSearchResults = withStyles(styles)(TraineeSearchResultsComponent);
