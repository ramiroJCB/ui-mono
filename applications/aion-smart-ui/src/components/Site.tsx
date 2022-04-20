import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { ContractorContainer } from '../containers/Contractor';
import { createStyles, Theme, WithStyles, withStyles, WithTheme } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IdentifyWorkerContainer } from 'containers/IdentifyWorker';
import { ISite } from 'interfaces/site';
import { LastActivityContainer } from 'containers/LastActivity';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { TraineeSearchForm } from 'containers/TraineeSearchForm';
import { WorkerContainer } from 'containers/Worker';
import { WorkersContainer } from 'containers/Workers';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
  employeeId?: string;
  contractorId?: string;
};
interface TabContainerProps {
  children?: React.ReactNode;
  dir?: string;
}

const TabContainer = ({ children, dir }: TabContainerProps) => (
  <Typography variant="body2" component="div" dir={dir} style={{ padding: 12 }}>
    {children}
  </Typography>
);

const styles = (theme: Theme) =>
  createStyles({
    tabsIndicator: {
      backgroundColor: theme.palette.primary.main,
      height: 4
    }
  });

type OwnProps = {
  site: DeepReadonly<ISite>;
};

type State = {
  value: number;
};

type Props = WithStyles<typeof styles> & WithTheme & RouteComponentProps<RouteParams> & OwnProps & I18nextProps;

class Site extends React.Component<Props, State> {
  inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: Props) {
    super(props);
    this.state = {
      value: 0
    };
    this.inputRef = React.createRef();
  }

  handleChange = (_event: React.ChangeEvent<{}>, value: number) => {
    this.setState({ value });
  };

  handleChangeIndex = (index: number) => {
    this.setState({ value: index });
  };

  render() {
    const {
      classes,
      match: {
        params: { employeeId, contractorId }
      },
      theme,
      t
    } = this.props;
    const { value } = this.state;
    return (
      <GridContainer>
        <Grid item xs={12} lg={6}>
          <Paper>
            {contractorId ? (
              <ContractorContainer />
            ) : employeeId ? (
              <WorkerContainer />
            ) : (
              <React.Fragment>
                <Hidden smDown>
                  <GridContainer>
                    <Grid item xs={12}>
                      <Typography variant="h6">{t('smart.site.identifyAWorker', 'Identify a Worker')}</Typography>
                    </Grid>
                  </GridContainer>
                </Hidden>

                <GridContainer>
                  <Grid item xs={12}>
                    <Tabs
                      value={value}
                      onChange={this.handleChange}
                      textColor="primary"
                      classes={{ indicator: classes.tabsIndicator }}
                    >
                      <Tab label={t('smart.site.usePecId', 'Use PEC ID')} />
                      <Tab label={t('smart.site.usePersonalDetails', 'Use Personal Details')} />
                    </Tabs>
                  </Grid>
                </GridContainer>
                <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={value}
                  onChangeIndex={this.handleChangeIndex}
                >
                  <TabContainer dir={theme.direction}>
                    <IdentifyWorkerContainer inputRef={this.inputRef} />
                  </TabContainer>
                  <TabContainer dir={theme.direction}>
                    <TraineeSearchForm />
                  </TabContainer>
                </SwipeableViews>
              </React.Fragment>
            )}
          </Paper>
          {!employeeId && <LastActivityContainer inputRef={this.inputRef} />}
        </Grid>
        <Hidden mdDown>
          <Grid item lg={6}>
            <Paper>
              <WorkersContainer />
            </Paper>
          </Grid>
        </Hidden>
      </GridContainer>
    );
  }
}

export const SiteComponent = withStyles(styles, { withTheme: true })(withRouter(withTranslation()(Site)));
