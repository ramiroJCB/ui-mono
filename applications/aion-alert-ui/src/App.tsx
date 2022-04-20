import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AddTaskGroupContainer } from 'features/tasks/client/taskGroup/containers/AddTaskGroup';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { ClientContractorsContainer } from 'features/tasks/client/contractors/containers/ClientContractors';
import { ClientContractorTasksContainer } from 'features/tasks/client/contractorTasks/containers/ClientContractorTasks';
import { ClientTasksContainer } from 'features/tasks/client/tasks/containers/ClientTasks';
import { ContractorTasksContainer } from 'features/tasks/contractor/tasks/containers/ContractorTasks';
import { EditTaskGroupContainer } from 'features/tasks/client/taskGroup/containers/EditTaskGroup';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { HotJarWrapper } from '@pec/aion-ui-core/components/HotJarWrapper';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { OrganizationFeatureSwitch } from '@pec/aion-ui-components/containers/OrganizationFeatureSwitch';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { SnackbarProvider } from 'notistack';
import { store } from 'store';
import { TaskGroupContainer } from 'features/tasks/client/taskGroup/containers/TaskGroup';
import { TaskGroupContractorsContainer } from 'features/tasks/client/taskGroupContractors/containers/TaskGroupContractors';
import { TaskGroupsContainer } from 'features/tasks/client/taskGroups/containers/TaskGroups';
import { TaskThreadContainer } from 'features/tasks/taskThread/containers/TaskThread';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';

export const App: React.FC = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        preventDuplicate
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <React.Fragment>
          <NotifierContainer />
          <Router basename="/organizations">
            <Theme>
              {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
              <Route
                path="/:organizationId?"
                render={({
                  location,
                  match: {
                    params: { organizationId }
                  }
                }) => (
                  <RegisterInterceptors organizationId={organizationId}>
                    <HotJarWrapper>
                      <NavContainer organizationId={organizationId} title="Alerts" location={location}>
                        <GridContainer>
                          <Grid item xs={12}>
                            <Switch>
                              <Route
                                // This route was removed from the AlertsSection of main nav as part of TASK-6
                                // We decided not to remove the functionality since we might want to use this again, but also
                                // because someone may have bookmarked these routes
                                path="/:organizationId/alerts/taskGroups/contractors/:contractorId"
                                component={ClientContractorTasksContainer}
                              />
                              <Route
                                // This route was removed from the AlertsSection of main nav as part of TASK-6
                                // We decided not to remove the functionality since we might want to use this again, but also
                                // because someone may have bookmarked these routes
                                path="/:organizationId/alerts/taskGroups/contractors"
                                component={ClientContractorsContainer}
                              />
                              <Route path="/:organizationId/alerts/taskGroups/add" component={AddTaskGroupContainer} />
                              <Route
                                path="/:organizationId/alerts/taskGroups/:taskGroupId/contractors/:contractorId/task/:taskId"
                                component={TaskThreadContainer}
                              />
                              <Route
                                path="/:organizationId/alerts/taskGroups/:taskGroupId/contractors"
                                component={TaskGroupContractorsContainer}
                              />
                              <Route path="/:organizationId/alerts/taskGroups/all" component={TaskGroupsContainer} />
                              <Route
                                path="/:organizationId/alerts/tasks/all"
                                render={props => (
                                  <OrganizationFeatureSwitch
                                    clientComponent={ClientTasksContainer}
                                    subscriberComponent={ContractorTasksContainer}
                                    {...props}
                                  />
                                )}
                              />
                              <Route
                                path="/:organizationId/alerts/taskGroups/:taskGroupId/edit"
                                component={EditTaskGroupContainer}
                              />
                              <Route
                                path="/:organizationId/alerts/taskGroups/:taskGroupId"
                                component={TaskGroupContainer}
                              />

                              <Redirect
                                // TASK-28: This redirects any users who follow links from previously-generated emails,
                                // before we updated our routes. See user story TASK-6 or sub-task TASK-13 for more info.
                                from="/:organizationId/alerts/tasks/:taskGroupId/contractors/:contractorId/task/:taskId"
                                to="/:organizationId/alerts/taskGroups/:taskGroupId/contractors/:contractorId/task/:taskId"
                              />
                              <Route path="/:organizationId/alerts/tasks/:taskId" component={TaskThreadContainer} />
                              <Redirect from="/:organizationId" to="/:organizationId/alerts/tasks/all" />
                            </Switch>
                          </Grid>
                        </GridContainer>
                        <Footer />
                      </NavContainer>
                    </HotJarWrapper>
                  </RegisterInterceptors>
                )}
              />
            </Theme>
          </Router>
        </React.Fragment>
      </SnackbarProvider>
    </Provider>
  </ErrorBoundary>
);
