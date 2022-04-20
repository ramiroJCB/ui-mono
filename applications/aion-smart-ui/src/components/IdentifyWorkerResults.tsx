import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import { ChangeEmployer } from './ChangeEmployer';
import { DeepReadonly } from 'utility-types';
import { formatTraineeDisplayName } from 'helpers/formatTraineeDisplayName';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IChangeEmployerForm } from 'interfaces/changeEmployerForm';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import { IEmployeeRecord } from 'interfaces/employeeRecord';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { WorkerIcon } from './WorkerIcon';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  handleChangeEmployer: (newOrg: IChangeEmployerForm, traineeId: string) => Promise<IEmployeeRecord>;
  isFetching: boolean;
  organizationId: string;
  pecIdentifier: string;
  showBackButton: boolean;
  siteId: string;
  trainees: DeepReadonly<ITraineeWithEmployees[]>;
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
  errorText: {
    color: theme.palette.error.main
  },
  gutters: {
    paddingLeft: 0
  },
  listItemText: {
    width: 'calc(100% - 80px)'
  },
  root: {
    animation: 'slideDown 2s ease'
  },
  '@keyframes slideDown': {
    '0%': {
      opacity: 0,
      backgroundColor: '#4aaaad',
      transform: 'translateY(-30px)'
    },
    '100%': {
      opacity: 1,
      backgroundColor: '#ffffff',
      transform: 'translateY(0)'
    }
  }
});

export type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

export type State = {
  hasNewEmployeeRecord: boolean;
  selectedEmployeeId: string | null;
};

export class IdentifyWorkerResultsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasNewEmployeeRecord: false,
      selectedEmployeeId: null
    };
  }

  componentDidUpdate({ trainees: prevTrainees, pecIdentifier: prevPecIdentifier }: Props) {
    const { trainees, pecIdentifier } = this.props;
    const { hasNewEmployeeRecord } = this.state;

    const prevTraineesEmployeeCount = prevTrainees.reduce((sum, current) => (sum += current.employees.length), 0);

    const traineesEmployeeCount = trainees.reduce((sum, current) => (sum += current.employees.length), 0);

    if (!hasNewEmployeeRecord && prevTraineesEmployeeCount !== traineesEmployeeCount) {
      if (pecIdentifier === prevPecIdentifier) {
        if (trainees !== prevTrainees) {
          this.setState({ hasNewEmployeeRecord: true });
        }
      } else {
        this.setState({ hasNewEmployeeRecord: false });
      }
    }
  }

  handleClick = (employeeId: string) => (event: React.SyntheticEvent) => {
    event.preventDefault();
    this.setState({
      selectedEmployeeId: employeeId
    });
  };

  clearSelectedEmployeeId = () => {
    this.setState({ selectedEmployeeId: null });
  };

  onEmployerChange = (traineeId: string) => async (newOrg: IChangeEmployerForm) => {
    await this.props.handleChangeEmployer(newOrg, traineeId);
    this.clearSelectedEmployeeId();
  };

  render() {
    const { organizationId, showBackButton, siteId, trainees, classes, isFetching, t } = this.props;
    const { hasNewEmployeeRecord, selectedEmployeeId } = this.state;
    return (
      <GridContainer>
        <Grid item xs={12}>
          <Typography className={classes.traineeHeaderText} variant="h6">
            {trainees.some(trainee => trainee.employees.length > 0) ? (
              t('smart.identifyWorkerResults.selectRecord', 'Select Your Matching Record')
            ) : (
              <span className={classes.errorText}>
                {t(
                  'smart.identifyWorkerResults.workerNotFound',
                  'Worker not found. Please enter a different PEC ID or check in using your personal details.'
                )}
              </span>
            )}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List component="nav">
            {trainees.map((trainee, traineeIndex) =>
              trainee.employees.map((employee, employeeIndex) => (
                <IconListItem
                  key={employee.id}
                  primaryText={formatTraineeDisplayName(trainee.firstName, trainee.lastName)}
                  className={classes.largeAvatar}
                  classes={{
                    gutters: classes.gutters,
                    root: traineeIndex === 0 && employeeIndex === 0 && hasNewEmployeeRecord ? classes.root : undefined
                  }}
                  divider
                  photoUrl={trainee.photoUrl}
                  icon={<WorkerIcon className={classes.workerIcon} />}
                  secondaryTypographyProps={{ component: 'span' }}
                  secondaryAction={
                    <Button
                      variant="contained"
                      color="secondary"
                      component={Link}
                      to={`/${organizationId}/sites/${siteId}/workers/${employee.id}`}
                    >
                      {t('smart.common.select', 'Select')}
                    </Button>
                  }
                >
                  <div className={classes.listItemText}>
                    {t('smart.identifyWorkerResults.employer', {
                      defaultValue: 'Employer: {{employer}}',
                      employer: employee.organization.name
                    })}
                    <br />
                    <a
                      href="changeEmployer"
                      onClick={this.handleClick(employee.id)}
                      title={t('smart.identifyWorkerResults.changeEmployer', 'Change Employer')}
                      style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {t('smart.identifyWorkerResults.changeEmployer', 'Change Employer')}
                    </a>
                  </div>
                  {selectedEmployeeId === employee.id && (
                    <ChangeEmployer
                      isFetching={isFetching}
                      employerName={employee.organization.name}
                      onSubmit={this.onEmployerChange(trainee.id)}
                      trainee={trainee}
                      shouldDisplay={true}
                      closeDialog={this.clearSelectedEmployeeId}
                    />
                  )}
                </IconListItem>
              ))
            )}
          </List>
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
              {t('smart.identifyWorkerResults.backToCheckIn', 'Back to Check In Form')}
            </Button>
          </Grid>
        )}
      </GridContainer>
    );
  }
}

export const IdentifyWorkerResults = withStyles(styles)(withTranslation()(IdentifyWorkerResultsComponent));
