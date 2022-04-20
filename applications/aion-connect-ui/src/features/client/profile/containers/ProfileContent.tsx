import * as React from 'react';
import { connect } from 'react-redux';
import { fetchAccreditations } from 'features/contractor/accreditations/actions';
import { fetchAnnouncement } from 'features/contractor/announcements/actions/fetchAnnouncement';
import { fetchCertifications } from 'features/contractor/certifications/actions';
import { fetchLicenses } from 'features/contractor/licenses/actions';
import { fetchOfficeLocations } from 'features/contractor/officeLocations/actions';
import { fetchProjects } from 'features/contractor/projects/actions';
import { fetchReferences } from 'features/contractor/references/actions';
import { fetchTradeNames } from 'features/contractor/tradeNames/actions';
import { ProfileContentComponent } from 'features/contractor/profile/components/ProfileContent';
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
  const { viewAsClient } = state.profile;
  const { isFetching: isFetchingAccreditations, accreditations } = state.accreditations;
  const { isFetching: isFetchingAnnouncement, announcement } = state.announcement;
  const { isFetching: isFetchingCertifications, certifications } = state.certifications;
  const { isFetching: isFetchingLicenses, licenses } = state.licenses;
  const { isFetching: isFetchingProjects, projects } = state.projects;
  const { isFetching: isFetchingOfficeLocations } = state.officeLocations;
  const { isFetching: isFetchingReferences, references } = state.references;
  const { isFetching: isFetchingTradeNames, tradeNames } = state.tradeNames;

  return {
    isFetching:
      isFetchingAccreditations ||
      isFetchingAnnouncement ||
      isFetchingCertifications ||
      isFetchingLicenses ||
      isFetchingProjects ||
      isFetchingOfficeLocations ||
      isFetchingReferences ||
      isFetchingTradeNames,
    viewAsClient,
    references,
    announcement,
    projects,
    licenses,
    accreditations,
    certifications,
    tradeNames
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
  fetchAnnouncement: () => dispatch(fetchAnnouncement(contractorId)),
  fetchProjects: () => dispatch(fetchProjects(contractorId)),
  fetchLicenses: () => dispatch(fetchLicenses(contractorId)),
  fetchAccreditations: () => dispatch(fetchAccreditations(contractorId)),
  fetchCertifications: () => dispatch(fetchCertifications(contractorId)),
  fetchOfficeLocations: () => dispatch(fetchOfficeLocations(contractorId)),
  fetchReferences: () => dispatch(fetchReferences(contractorId)),
  fetchTradeNames: () => dispatch(fetchTradeNames(contractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ProfileContent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.setViewAsClient();
    props.fetchAnnouncement();
    props.fetchProjects();
    props.fetchLicenses();
    props.fetchAccreditations();
    props.fetchCertifications();
    props.fetchOfficeLocations();
    props.fetchReferences();
    props.fetchTradeNames();
  }

  render() {
    const {
      isFetching,
      viewAsClient,
      references,
      announcement,
      projects,
      licenses,
      certifications,
      accreditations,
      tradeNames
    } = this.props;

    return (
      <ProfileContentComponent
        isFetching={isFetching}
        viewAsClient={viewAsClient}
        references={references}
        announcement={announcement}
        projects={projects}
        licenses={licenses}
        certifications={certifications}
        accreditations={accreditations}
        tradeNames={tradeNames}
      />
    );
  }
}

export const ProfileContentContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileContent));
