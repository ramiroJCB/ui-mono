import * as React from 'react';
import { connect } from 'react-redux';
import { fetchContactInformationIfNeeded } from 'features/contractor/contactInformation/actions/fetchContactInformation';
import { fetchContractorOrganizationIfNeeded } from 'features/client/contractorOrganization/actions';
import { fetchCoverPhotoIfNeeded } from 'features/contractor/photoGallery/coverPhoto/actions/fetchCoverPhoto';
import { fetchLogoIfNeeded } from 'features/contractor/logo/actions/fetchLogo';
import { fetchPhotoGalleryMetaDataIfNeeded } from 'features/contractor/photoGallery/metaData/actions';
import { JumbotronComponent } from 'features/contractor/profile/components/Jumbotron';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { setViewAsClient } from 'features/contractor/profile/actions';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId: string;
};

const mapStateToProps = (state: RootState) => {
  const { isFetching: isFetchingOrganization, organization, error: organizationError } = state.contractorOrganization;
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
      params: { contractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  setViewAsClient: () => dispatch(setViewAsClient()),
  fetchContractorOrganizationIfNeeded: () => dispatch(fetchContractorOrganizationIfNeeded(contractorId)),
  fetchLogoIfNeeded: () => dispatch(fetchLogoIfNeeded(contractorId)),
  fetchCoverPhotoIfNeeded: () => dispatch(fetchCoverPhotoIfNeeded(contractorId)),
  fetchPhotoGalleryMetaDataIfNeeded: () => dispatch(fetchPhotoGalleryMetaDataIfNeeded(contractorId)),
  fetchContactInformationIfNeeded: () => dispatch(fetchContactInformationIfNeeded(contractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class Jumbotron extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setViewAsClient();
    props.fetchContractorOrganizationIfNeeded();
    props.fetchLogoIfNeeded();
    props.fetchCoverPhotoIfNeeded();
    props.fetchPhotoGalleryMetaDataIfNeeded();
    props.fetchContactInformationIfNeeded();
  }

  render() {
    const {
      isFetching,
      error,
      organization,
      viewAsClient,
      metaData,
      match: {
        params: { contractorId }
      }
    } = this.props;

    return (
      <JumbotronComponent
        isClient
        organization={organization}
        viewAsClient={viewAsClient}
        isFetching={isFetching}
        error={error}
        metaData={metaData}
        contractorId={contractorId}
      />
    );
  }
}

export const JumbotronContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Jumbotron));
