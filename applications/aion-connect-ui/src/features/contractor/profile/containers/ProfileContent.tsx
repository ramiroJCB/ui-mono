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
import { ProfileContentComponent } from '../components/ProfileContent';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
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
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchAnnouncement: () => dispatch(fetchAnnouncement(organizationId)),
  fetchProjects: () => dispatch(fetchProjects(organizationId)),
  fetchLicenses: () => dispatch(fetchLicenses(organizationId)),
  fetchAccreditations: () => dispatch(fetchAccreditations(organizationId)),
  fetchCertifications: () => dispatch(fetchCertifications(organizationId)),
  fetchOfficeLocations: () => dispatch(fetchOfficeLocations(organizationId)),
  fetchReferences: () => dispatch(fetchReferences(organizationId)),
  fetchTradeNames: () => dispatch(fetchTradeNames(organizationId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class ProfileContent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
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
