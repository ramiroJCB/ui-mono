import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import MapIcon from '@material-ui/icons/Map';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { ContractorWorkGroupHeader } from './ContractorWorkGroupHeader';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IWorkGroupContractor } from 'interfaces/workGroupContractor';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const styles = () =>
  createStyles({
    gridItem: {
      display: 'flex'
    },
    label: {
      fontWeight: 'bold'
    },
    icon: {
      marginRight: 10
    }
  });

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
};

type OwnProps = {
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  workGroupContractor: DeepReadonly<IWorkGroupContractor> | null;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const ContractorWorkGroupGeneralInfo: React.FC<Props> = ({ classes, isFetching, error, workGroupContractor }) => {
  const { t } = useTranslation();

  return !isFetching && workGroupContractor ? (
    <React.Fragment>
      <ContractorWorkGroupHeader workGroupContractor={workGroupContractor} isFetching={isFetching} />
      <GridContainer>
        <Grid item xs={12}>
          <Paper>
            <GridContainer>
              <Grid item xs={12} className={classes.gridItem}>
                <MapIcon className={classes.icon} />
                <Typography variant="body1" color="textSecondary">
                  {t('trainingCompliance.common.workGroup', 'Work Group')}
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.gridItem}>
                <Typography variant="h5" className={classes.label}>
                  {workGroupContractor.workGroupName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">{workGroupContractor.workGroup.description}</Typography>
              </Grid>
            </GridContainer>
          </Paper>
        </Grid>
      </GridContainer>
    </React.Fragment>
  ) : error ? (
    <Error
      message={t('trainingCompliance.common.processingRequestError', 'There was an error processing your request.')}
    />
  ) : (
    <Loading />
  );
};

export const ContractorWorkGroupGeneralInfoComponent = withRouter(withStyles(styles)(ContractorWorkGroupGeneralInfo));
