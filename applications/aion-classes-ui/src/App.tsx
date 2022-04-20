import * as React from 'react';
import { AddReservationContainer } from 'features/reservation/containers/AddReservation';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ClassDetailsContainer } from 'features/class/containers/ClassDetails';
import { ClassesListContainer } from 'features/classes/containers/ClassesList';
import { EditReservationContainer } from 'features/reservation/containers/EditReservation';
import { ErrorBoundary } from '@pec/aion-ui-core/components/ErrorBoundary';
import { Footer } from '@pec/aion-ui-components/containers/Footer';
import { NavContainer } from '@pec/aion-ui-components/containers/Nav';
import { NotifierContainer } from '@pec/aion-ui-components/containers/Notifier';
import { Provider } from 'react-redux';
import { RegisterInterceptors } from '@pec/aion-ui-components/containers/RegisterInterceptors';
import { ReservationsReportContainer } from 'features/reports/reservations/containers/ReservationsReport';
import { SnackbarProvider } from 'notistack';
import { store } from 'store';
import { Theme } from '@pec/aion-ui-components/components/Theme';
import { Trackers } from '@pec/aion-ui-core/containers/Trackers';
import { useTranslation } from 'react-i18next';

export const App: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router basename="/classes">
          <Theme>
            <SnackbarProvider
              maxSnack={2}
              preventDuplicate
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <React.Fragment>
                <NotifierContainer />
                {process.env.NODE_ENV === 'production' && <Route component={Trackers} />}
                <Route
                  render={({ location }) => (
                    <RegisterInterceptors>
                      <NavContainer
                        title={t('classes.common.upcomingClasses', 'Upcoming classes').toString()}
                        location={location}
                      >
                        <Switch>
                          <Route path="/reports/reservations" component={ReservationsReportContainer} />
                          <Route path="/:classId/reservations/add" component={AddReservationContainer} />
                          <Route
                            path="/:classId/reservations/:reservationId/edit"
                            component={EditReservationContainer}
                          />
                          <Route path="/:classId" component={ClassDetailsContainer} />
                          <Route path="/" component={ClassesListContainer} />
                        </Switch>
                        <Footer />
                      </NavContainer>
                    </RegisterInterceptors>
                  )}
                />
              </React.Fragment>
            </SnackbarProvider>
          </Theme>
        </Router>
      </Provider>
    </ErrorBoundary>
  );
};
