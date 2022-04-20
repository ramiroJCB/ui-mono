import * as React from 'react';
import { connect } from 'react-redux';
import { fetchContactInformationIfNeeded } from 'features/contractor/contactInformation/actions/fetchContactInformation';
import { fetchCoverPhotoIfNeeded } from 'features/contractor/photoGallery/coverPhoto/actions/fetchCoverPhoto';
import { fetchLogoIfNeeded } from 'features/contractor/logo/actions/fetchLogo';
import { fetchOrganizationIfNeeded } from '@pec/aion-ui-core/actions/organization';
import { fetchPhotoGalleryMetaDataIfNeeded } from 'features/contractor/photoGallery/metaData/actions';
import { JumbotronComponent } from '../components/Jumbotron';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => {
  const { isFetching: isFetchingOrganization, organization, fetchError: organizationError } = state.organization;
  const { error: contactInformationError } = state.contactInformation;
  const { isFetching: isFetchingCoverPhoto, error: coverPhotoError } = state.photoGalleryCoverPhoto;
  const { metaData } = state.photoGalleryMetaData;
  const { isFetching: isFetchingLogo, error: logoError } = state.logo;
  const { viewAsClient } = state.profile;

  return {
    isFetching: isFetchingOrganization || isFetchingLogo || isFetchingCoverPhoto,
    metaData,
    organization,
    viewAsClient,
    error: organizationError || contactInformationError || logoError || coverPhotoError
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchOrganizationIfNeeded: () => dispatch(fetchOrganizationIfNeeded(organizationId)),
  fetchLogoIfNeeded: () => dispatch(fetchLogoIfNeeded(organizationId)),
  fetchCoverPhotoIfNeeded: () => dispatch(fetchCoverPhotoIfNeeded(organizationId)),
  fetchPhotoGalleryMetaDataIfNeeded: () => dispatch(fetchPhotoGalleryMetaDataIfNeeded(organizationId)),
  fetchContactInformationIfNeeded: () => dispatch(fetchContactInformationIfNeeded(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Jumbotron extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchOrganizationIfNeeded();
    props.fetchLogoIfNeeded();
    props.fetchCoverPhotoIfNeeded();
    props.fetchPhotoGalleryMetaDataIfNeeded();
    props.fetchContactInformationIfNeeded();
  }

  render() {
    const { isFetching, error, organization, viewAsClient, metaData } = this.props;

    return (
      <JumbotronComponent
        organization={organization}
        viewAsClient={viewAsClient}
        isFetching={isFetching}
        error={error}
        metaData={metaData}
      />
    );
  }
}

export const JumbotronContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Jumbotron));
