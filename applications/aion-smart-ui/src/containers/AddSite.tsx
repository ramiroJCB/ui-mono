import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import withWidth, { isWidthDown, isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { addSite } from 'actions/addSite';
import { connect } from 'react-redux';
import { DeepReadonly } from 'utility-types';
import { destroy } from 'redux-form';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchCurrentLocation, fetchSiteLocation, resetSiteLocation } from 'actions/siteLocation';
import { fetchSiteTagsIfNeeded } from 'actions/siteTags';
import { fetchWorkGroups } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { ISite, ISiteForm, ISiteLocation, SiteMode, SiteStatus } from 'interfaces/site';
import { ISiteTag } from 'interfaces/siteTag';
import { IWorkGroup } from '@pec/aion-ui-core/interfaces/workGroup';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NavContainer } from './Nav';
import { Paper } from '@material-ui/core';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { SiteDetailsForm } from 'components/SiteDetailsForm';
import { SiteLocationForm } from 'components/SiteLocationForm';
import { SiteLocationMapComponent } from 'components/SiteLocationMap';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  mode: SiteMode;
};

const mapStateToProps = ({
  serverTokens: { gmapsIsLoaded },
  siteLocation: { isFetching: isFetchingLocation, siteLocation },
  siteTags: { isFetching: isFetchingTags, siteTags, error },
  workGroups: { isFetching: isFetchingWorkgroups, workGroups },
  userInfo: { userInfo }
}: RootState) => ({
  gmapsIsLoaded,
  siteLocation,
  siteTags,
  isFetching: isFetchingTags || isFetchingWorkgroups,
  error,
  isFetchingLocation,
  workGroups,
  userInfo
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  destroyForm: () => dispatch(destroy('siteForm')),
  addSite: (site: ISite) => dispatch(addSite({ ...site, organizationId }, history)),
  fetchSiteTagsIfNeeded: () => dispatch(fetchSiteTagsIfNeeded(organizationId)),
  fetchCurrentLocation: (geocoder: google.maps.Geocoder, errorCallback: () => void) =>
    dispatch(fetchCurrentLocation(geocoder, errorCallback)),
  fetchSiteLocation: (geocoder: google.maps.Geocoder, address: string) =>
    dispatch(fetchSiteLocation(geocoder, address)),
  resetSiteLocation: () => dispatch(resetSiteLocation()),
  fetchWorkGroups: () => dispatch(fetchWorkGroups(organizationId, null))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithWidth &
  RouteComponentProps<RouteParams>;

class AddSite extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchSiteTagsIfNeeded();
    this.props.resetSiteLocation();
    if (hasPermission(props.userInfo, ActivityAction.Read, ActivityResourceName.TrainingComplianceWorkGroups)) {
      this.props.fetchWorkGroups();
    }
  }

  componentWillUnmount() {
    this.props.destroyForm();
  }

  onSubmit = async (siteForm: ISiteForm) =>
    await this.props.addSite({
      ...siteForm,
      tags: siteForm.tags.map(t => t.name),
      workGroups: Object.keys(siteForm.itemsWorkgroups).reduce((accumulator: string[], cursor: string) => {
        if (siteForm.itemsWorkgroups[cursor] === true) accumulator.push(cursor);
        return accumulator;
      }, [])
    });

  renderSiteDetailsForm = (
    initialValues: Partial<ISiteForm>,
    siteTags: DeepReadonly<ISiteTag[]>,
    workGroups: DeepReadonly<IWorkGroup[]> | null
  ) => (
    <SiteDetailsForm
      organizationId={this.props.match.params.organizationId}
      onSubmit={this.onSubmit}
      initialValues={initialValues}
      siteTags={siteTags}
      workGroups={workGroups || []}
    />
  );

  renderSiteLocationForm = (initialValues: Partial<ISiteForm>, enabledButtonNext: boolean) => {
    const {
      isFetchingLocation,
      match: {
        params: { organizationId }
      }
    } = this.props;
    return (
      <SiteLocationForm
        organizationId={organizationId}
        handleCurrentLocation={this.props.fetchCurrentLocation}
        handleLocationChange={this.props.fetchSiteLocation}
        initialValues={initialValues}
        isFetchingLocation={isFetchingLocation}
        enabledButtonNext={enabledButtonNext}
      />
    );
  };

  renderMap = (
    { formattedAddress: initialAddress, latitude: initialLat, longitude: initialLong }: Partial<ISiteForm>,
    siteLocation: ISiteLocation | null,
    isFetchingLocation: boolean
  ) => {
    const { formattedAddress, latitude, longitude } = siteLocation || {};
    return (
      <>
        <SiteLocationMapComponent
          location={{
            formattedAddress: formattedAddress || initialAddress || null,
            latitude: latitude || initialLat || null,
            longitude: longitude || initialLong || null
          }}
          isFetchingLocation={isFetchingLocation}
        />
      </>
    );
  };

  render() {
    const {
      gmapsIsLoaded,
      siteLocation,
      siteTags,
      isFetching,
      error,
      match: {
        params: { organizationId, mode }
      },
      width,
      workGroups,
      isFetchingLocation
    } = this.props;
    const initialValues = {
      organizationId,
      status: SiteStatus.Active,
      tags: [],
      workGroups: [],
      itemsWorkgroups: {},
      ...siteLocation
    };
    return (
      <NavContainer title="Site">
        {gmapsIsLoaded && siteTags && !isFetching ? (
          isWidthUp('md', width) ? (
            <Paper style={{ height: '100%', display: 'flex', margin: '8px 0px 8px 8px', minHeight: 'max-content' }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  {this.renderSiteLocationForm(initialValues, isWidthDown('sm', width))}
                  {this.renderSiteDetailsForm(initialValues, siteTags, workGroups)}
                </Grid>
                <Grid item container xs={12} md={6}>
                  {this.renderMap(initialValues, siteLocation, isFetchingLocation)}
                </Grid>
              </Grid>
            </Paper>
          ) : mode === SiteMode.location ? (
            <GridContainer>
              <Grid item xs={12} md={6}>
                {this.renderMap(initialValues, siteLocation, isFetchingLocation)}
                {this.renderSiteLocationForm(initialValues, isWidthDown('sm', width))}
              </Grid>
            </GridContainer>
          ) : (
            this.renderSiteDetailsForm(initialValues, siteTags, workGroups)
          )
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </NavContainer>
    );
  }
}

export const AddSiteContainer = connect(mapStateToProps, mapDispatchToProps)(withWidth()(AddSite));
