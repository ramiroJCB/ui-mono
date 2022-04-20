import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { connect } from 'react-redux';
import { DeepReadonly } from 'utility-types';
import { deleteSite } from 'actions/deleteSite';
import { destroy } from 'redux-form';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchCurrentLocation, fetchSiteLocation } from 'actions/siteLocation';
import { fetchSiteIfNeeded } from 'actions/fetchSite';
import { fetchSiteTagsIfNeeded } from 'actions/siteTags';
import { fetchWorkGroups } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { hasPermission } from '@pec/aion-ui-core/actions/userInfo';
import { ISite, ISiteForm, SiteMode } from 'interfaces/site';
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
import { updateSite } from 'actions/updateSite';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
  siteId: string;
  mode: SiteMode;
};

const mapStateToProps = ({
  serverTokens: { gmapsIsLoaded },
  site: { isFetching: isFetchingSite, site, error: siteError, isDeleting },
  siteLocation: { isFetching: isFetchingLocation, siteLocation },
  siteTags: { isFetching: isFetchingSiteTags, siteTags, error: siteTagsError },
  workGroups: { isFetching: isFetchingWorkgroups, workGroups },
  userInfo: { userInfo }
}: RootState) => ({
  gmapsIsLoaded,
  isFetching: isFetchingSite || isFetchingSiteTags || isFetchingWorkgroups,
  siteForm:
    site &&
    siteTags &&
    ({
      ...site,
      ...siteLocation,
      tags: site.tags.reduce((a, tagName) => {
        const tag = siteTags.find(({ name }) => name === tagName);
        return tag ? a.concat([tag]) : a;
      }, [] as ISiteTag[]),
      workGroups:
        site.workGroups &&
        site.workGroups.reduce((a, workGroupId) => {
          const item: IWorkGroup = {
            id: workGroupId,
            organizationId: '',
            name: '',
            description: '',
            compliantContractorCount: 0,
            totalContractorCount: 0,
            compliantContractorPercentage: 0,
            contractorCountUpdatedDateUtc: '',
            isDeleted: false,
            serviceRegions: []
          };
          return a.concat([item]);
        }, [] as IWorkGroup[]),
      itemsWorkgroups:
        site.workGroups === null
          ? {}
          : site.workGroups.reduce((a: { [id: string]: boolean }, workGroupId: string) => {
              return { ...a, [workGroupId]: true };
            }, {} as { [id: string]: boolean })
    } as ISiteForm),
  siteTags,
  error: siteError || siteTagsError,
  isDeleting,
  isFetchingLocation,
  workGroups,
  userInfo
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { organizationId, siteId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  destroyForm: () => dispatch(destroy('siteForm')),
  fetchSiteIfNeeded: () => dispatch(fetchSiteIfNeeded(organizationId, siteId)),
  fetchSiteTagsIfNeeded: () => dispatch(fetchSiteTagsIfNeeded(organizationId)),
  updateSite: (site: ISite) => dispatch(updateSite(site, history)),
  fetchCurrentLocation: (geocoder: google.maps.Geocoder, errorCallback: () => void) =>
    dispatch(fetchCurrentLocation(geocoder, errorCallback)),
  fetchSiteLocation: (geocoder: google.maps.Geocoder, address: string) =>
    dispatch(fetchSiteLocation(geocoder, address)),
  deleteSite: () => dispatch(deleteSite(organizationId, siteId, history)),
  fetchWorkGroups: () => dispatch(fetchWorkGroups(organizationId, null))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  WithWidth &
  RouteComponentProps<RouteParams> &
  I18nextProps;

class EditSite extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    this.props.fetchSiteIfNeeded();
    this.props.fetchSiteTagsIfNeeded();
    if (hasPermission(props.userInfo, ActivityAction.Read, ActivityResourceName.TrainingComplianceWorkGroups)) {
      this.props.fetchWorkGroups();
    }
  }

  renderMap = (
    { formattedAddress: initialAddress, latitude: initialLat, longitude: initialLong }: Partial<ISiteForm>,
    isFetchingLocation: boolean
  ) => {
    return (
      <SiteLocationMapComponent
        location={{
          formattedAddress: initialAddress || null,
          latitude: initialLat || null,
          longitude: initialLong || null
        }}
        isFetchingLocation={isFetchingLocation}
      />
    );
  };

  componentWillUnmount() {
    this.props.destroyForm();
  }

  onSubmit = async (siteForm: ISiteForm) => {
    var permissionWorkGroups = hasPermission(
      this.props.userInfo,
      ActivityAction.Read,
      ActivityResourceName.TrainingComplianceWorkGroups
    );
    await this.props.updateSite({
      ...siteForm,
      tags: siteForm.tags.map(t => t.name),
      workGroups: !permissionWorkGroups
        ? null
        : Object.keys(siteForm.itemsWorkgroups).reduce((acc: string[], cur: string) => {
            if (siteForm.itemsWorkgroups[cur] === true) acc.push(cur);
            return acc;
          }, [])
    });
  };

  onDeleteConfirm = async () => await this.props.deleteSite();

  renderSiteDetailsForm = (
    siteForm: ISiteForm,
    siteTags: DeepReadonly<ISiteTag[]>,
    workGroups: DeepReadonly<IWorkGroup[] | null>
  ) => (
    <SiteDetailsForm
      onSubmit={this.onSubmit}
      onDeleteConfirm={this.onDeleteConfirm}
      initialValues={siteForm}
      siteTags={siteTags}
      workGroups={workGroups}
    />
  );

  renderSiteLocationForm = (siteForm: ISiteForm, enabledButtonNext: boolean) => {
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
        onSubmit={this.onSubmit}
        initialValues={siteForm}
        isFetchingLocation={isFetchingLocation}
        enabledButtonNext={enabledButtonNext}
      />
    );
  };

  render() {
    const {
      gmapsIsLoaded,
      siteForm,
      siteTags,
      isFetching,
      isDeleting,
      error,
      match: {
        params: { mode }
      },
      width,
      isFetchingLocation,
      workGroups,
      t
    } = this.props;
    return (
      <NavContainer title={t('smart.common.site', 'Site')}>
        {gmapsIsLoaded && siteForm && siteTags && !isFetching && !isDeleting ? (
          isWidthUp('md', width) ? (
            <Paper style={{ height: '100%', display: 'flex', minHeight: 'max-content' }}>
              <GridContainer>
                <Grid item xs={12} md={6}>
                  {this.renderSiteLocationForm(siteForm, false)}
                  {this.renderSiteDetailsForm(siteForm, siteTags, workGroups)}
                </Grid>
                <Grid item container xs={12} md={6}>
                  {this.renderMap(siteForm, isFetchingLocation)}
                </Grid>
              </GridContainer>
            </Paper>
          ) : mode === SiteMode.location ? (
            <GridContainer>
              <Grid item xs={12} md={6}>
                {this.renderMap(siteForm, isFetchingLocation)}
                {this.renderSiteLocationForm(siteForm, true)}
              </Grid>
            </GridContainer>
          ) : (
            this.renderSiteDetailsForm(siteForm, siteTags, workGroups)
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

export const EditSiteContainer = connect(mapStateToProps, mapDispatchToProps)(withWidth()(withTranslation()(EditSite)));
