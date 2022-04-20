import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { ClientIncidentsFormFiltersContainer } from './ClientIncidentsFormFilters';
import { ClientIncidentsTableComponent } from '../components/ClientIncidentsTable';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Form, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientIncidentsForm } from 'interfaces/clientIncidentsForm';
import { IIncident } from 'interfaces/incident';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Popover } from '@pec/aion-ui-core/components/Popover';
import { validateDateRange } from '@pec/aion-ui-core/validators';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  organizationId: string;
  incidents: DeepReadonly<IIncident[]> | null;
  responseError: DeepReadonly<AxiosError> | null;
  isFetching: boolean;
  page: number;
  totalCount: number;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
};

type Props = InjectedFormProps<IClientIncidentsForm, OwnProps> & OwnProps & I18nextProps;

class ClientIncidentsFormComponent extends React.Component<Props> {
  render() {
    const {
      organizationId,
      submitting,
      pristine,
      invalid,
      handleSubmit,
      incidents,
      responseError,
      isFetching,
      handleChangePage,
      page,
      totalCount,
      t
    } = this.props;

    return (
      <Form onSubmit={handleSubmit} style={{ flex: 1 }}>
        <GridContainer justify="space-between">
          <Grid item>
            <Typography variant="h5" component="h1">
              {t('reporting.incidents.clientIncidents.leadingIndicatorReport', 'Leading Indicator Report')}
            </Typography>
          </Grid>
          <Grid item>
            <Popover
              id="manage-incident-properties"
              render={({ buttonProps, menuProps }) => (
                <React.Fragment>
                  <Button {...buttonProps} variant="contained" color="secondary">
                    {t('reporting.incidents.clientIncidents.manage', 'Manage')}
                  </Button>
                  <Menu {...menuProps} onClick={menuProps.onClose}>
                    <MenuItem component={Link} to={`/${organizationId}/reporting/incidents/types`}>
                      {t('reporting.common.behaviorCategories', 'Behavior Categories')}
                    </MenuItem>
                    <MenuItem component={Link} to={`/${organizationId}/reporting/incidents/categories`}>
                      {t('reporting.common.classifications', 'Classifications')}
                    </MenuItem>
                    <MenuItem component={Link} to={`/${organizationId}/reporting/incidents/regions`}>
                      {t('reporting.common.regions', 'Regions')}
                    </MenuItem>
                    <MenuItem component={Link} to={`/${organizationId}/reporting/incidents/rootCauses`}>
                      {t('reporting.common.rootCauses', 'Root Causes')}
                    </MenuItem>
                    <MenuItem component={Link} to={`/${organizationId}/reporting/incidents/workGroups`}>
                      {t('reporting.common.workGroups', 'Work Groups')}
                    </MenuItem>
                  </Menu>
                </React.Fragment>
              )}
            />
          </Grid>
        </GridContainer>
        <GridContainer alignItems="flex-start" justify="space-between">
          <ClientIncidentsFormFiltersContainer />
          <Grid item>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={submitting || pristine || invalid}
            >
              {t('reporting.common.apply', 'Apply')}
            </Button>
          </Grid>
        </GridContainer>
        {incidents && !isFetching ? (
          <ClientIncidentsTableComponent
            incidents={incidents}
            handleChangePage={handleChangePage}
            page={page}
            totalCount={totalCount}
          />
        ) : responseError ? (
          <Error />
        ) : (
          <Loading />
        )}
      </Form>
    );
  }
}

export const ClientIncidentsForm = reduxForm<IClientIncidentsForm, OwnProps>({
  form: 'clientIncidentsForm',
  validate: validateDateRange,
  enableReinitialize: true
})(withTranslation()(ClientIncidentsFormComponent));
