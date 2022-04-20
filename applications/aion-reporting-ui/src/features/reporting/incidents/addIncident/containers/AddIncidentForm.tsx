import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { addIncident } from '../actions';
import { AddIncidentFormComponent } from '../components/AddIncidentForm';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchClientIfNeeded } from '@pec/aion-ui-core/actions/client';
import { fetchClientIncidentCategoriesIfNeeded } from '../../clientCategories/actions/fetchClientIncidentCategories';
import { fetchClientIncidentRegionsIfNeeded } from '../../clientRegions/actions/fetchClientIncidentRegions';
import { fetchClientIncidentRootCausesIfNeeded } from '../../clientRootCauses/actions/fetchClientIncidentRootCauses';
import { fetchClientIncidentTypesIfNeeded } from '../../clientTypes/actions/fetchClientIncidentTypes';
import { fetchClientIncidentWorkGroupsIfNeeded } from '../../clientWorkGroups/actions/fetchClientIncidentWorkGroups';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IIncident } from 'interfaces/incident';
import { IncidentCategoryStatus } from 'interfaces/incidentCategory';
import { IncidentRegionStatus } from 'interfaces/incidentRegion';
import { IncidentRootCauseStatus } from 'interfaces/incidentRootCause';
import { IncidentTypeStatus } from 'interfaces/incidentType';
import { IncidentWorkGroupStatus } from 'interfaces/incidentWorkGroup';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

type RouteParams = {
  organizationId: string;
  clientId: string;
};

const mapStateToProps = ({
  client: { client, isFetching: isFetchingClient, error: clientError },
  clientIncidentCategories: {
    incidentCategories,
    isFetching: isFetchingClientIncidentCategories,
    error: clientIncidentCategoriesError
  },
  clientIncidentRootCauses: {
    incidentRootCauses,
    isFetching: isFetchingClientIncidentRootCauses,
    error: clientIncidentRootCausesError
  },
  clientIncidentWorkGroups: {
    incidentWorkGroups,
    isFetching: isFetchingClientIncidentWorkGroups,
    error: clientIncidentWorkGroupsError
  },
  clientIncidentRegions: {
    incidentRegions,
    isFetching: isFetchingClientIncidentRegions,
    error: clientIncidentRegionsError
  },
  clientIncidentTypes: { incidentTypes, isFetching: isFetchingClientIncidentTypes, error: clientIncidentTypesError }
}: RootState) => ({
  client,
  incidentCategories:
    incidentCategories && incidentCategories.filter(({ status }) => status === IncidentCategoryStatus.Active),
  incidentRootCauses:
    incidentRootCauses && incidentRootCauses.filter(({ status }) => status === IncidentRootCauseStatus.Active),
  incidentRegions: incidentRegions && incidentRegions.filter(({ status }) => status === IncidentRegionStatus.Active),
  incidentWorkGroups:
    incidentWorkGroups && incidentWorkGroups.filter(({ status }) => status === IncidentWorkGroupStatus.Active),
  incidentTypes: incidentTypes && incidentTypes.filter(({ status }) => status === IncidentTypeStatus.Active),
  isFetching:
    isFetchingClient ||
    isFetchingClientIncidentCategories ||
    isFetchingClientIncidentRootCauses ||
    isFetchingClientIncidentRegions ||
    isFetchingClientIncidentWorkGroups ||
    isFetchingClientIncidentTypes,
  error:
    clientError ||
    clientIncidentCategoriesError ||
    clientIncidentRootCausesError ||
    clientIncidentTypesError ||
    clientIncidentWorkGroupsError ||
    clientIncidentRegionsError
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, clientId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  addIncident: (incidentForm: IIncident) => dispatch(addIncident(organizationId, incidentForm, history)),
  fetchClientIfNeeded: () => dispatch(fetchClientIfNeeded(clientId)),
  fetchClientIncidentCategoriesIfNeeded: () => dispatch(fetchClientIncidentCategoriesIfNeeded(clientId)),
  fetchClientIncidentRootCausesIfNeeded: () => dispatch(fetchClientIncidentRootCausesIfNeeded(clientId)),
  fetchClientIncidentRegionsIfNeeded: () => dispatch(fetchClientIncidentRegionsIfNeeded(clientId)),
  fetchClientIncidentWorkGroupsIfNeeded: () => dispatch(fetchClientIncidentWorkGroupsIfNeeded(clientId)),
  fetchClientIncidentTypesIfNeeded: () => dispatch(fetchClientIncidentTypesIfNeeded(clientId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class AddIncidentForm extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchClientIfNeeded();
    props.fetchClientIncidentCategoriesIfNeeded();
    props.fetchClientIncidentTypesIfNeeded();
    props.fetchClientIncidentRootCausesIfNeeded();
    props.fetchClientIncidentRegionsIfNeeded();
    props.fetchClientIncidentWorkGroupsIfNeeded();
  }
  onSubmitIncidentForm = async (incidentForm: IIncident) => await this.props.addIncident(incidentForm);

  render() {
    const {
      client,
      incidentCategories,
      incidentRootCauses,
      incidentRegions,
      incidentWorkGroups,
      incidentTypes,
      isFetching,
      error,
      match: {
        params: { organizationId, clientId }
      },
      t
    } = this.props;

    const today = localizeDate(new Date(), t);

    return client &&
      incidentRootCauses &&
      incidentRegions &&
      incidentWorkGroups &&
      incidentCategories &&
      incidentTypes &&
      !isFetching ? (
      incidentCategories.length > 0 &&
      incidentRegions.length > 0 &&
      incidentWorkGroups.length > 0 &&
      incidentTypes.length > 0 ? (
        <AddIncidentFormComponent
          clientName={client.name}
          incidentCategories={incidentCategories}
          incidentRootCauses={incidentRootCauses}
          incidentRegions={incidentRegions}
          incidentWorkGroups={incidentWorkGroups}
          incidentTypes={incidentTypes}
          initialValues={{
            clientId,
            contractorId: organizationId,
            occurredOnDateUtc: today,
            latitude: null,
            longitude: null,
            formattedAddress: null
          }}
          onSubmit={this.onSubmitIncidentForm}
          organizationId={organizationId}
        />
      ) : (
        <GridContainer>
          <Grid item xs={12} style={{ textAlign: 'center' }}>
            <Typography variant="h5">
              {t('reporting.incidents.addIncident.nameNotSet', {
                name: client.name,
                defaultValue: '{{name}} has not yet set up leading indicator reporting.'
              })}
            </Typography>
          </Grid>
        </GridContainer>
      )
    ) : error ? (
      <Error />
    ) : (
      <Loading />
    );
  }
}

export const AddIncidentFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddIncidentForm));
