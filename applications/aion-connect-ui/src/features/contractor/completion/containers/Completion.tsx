import * as React from 'react';
import { CompletionComponent } from '../components/Completion';
import { connect } from 'react-redux';
import { RootState } from 'combineReducers';

const mapStateToProps = ({
  profile: { viewAsClient },
  logo: { isFetching: isFetchingLogo, logo },
  contactInformation: { isFetching: isFetchingContactInformation, contactInformation },
  projects: { isFetching: isFetchingProjects, projects },
  accreditations: { isFetching: isFetchingAccreditations, accreditations },
  licenses: { isFetching: isFetchingLicenses, licenses },
  certifications: { isFetching: isFetchingCertifications, certifications },
  officeLocations: { isFetching: isFetchingOfficeLocations, officeLocations },
  references: { isFetching: isFetchingReferences, references }
}: RootState) => {
  const TOTAL_SECTION_COUNT = 8;

  const hasCompletedLogoSection = Boolean(logo);
  const hasCompletedContactInformationSection = Boolean(
    contactInformation?.emailAddress || contactInformation?.phoneNumber || contactInformation?.websiteUrl
  );

  const otherSections = [projects, accreditations, licenses, certifications, officeLocations, references];
  const completedOtherSectionsCount = otherSections.reduce((a, b) => (a += b?.length > 0 ? 1 : 0), 0);

  const completedSectionsCount =
    Number(hasCompletedLogoSection) + Number(hasCompletedContactInformationSection) + completedOtherSectionsCount;

  return {
    isFetching:
      isFetchingLogo ||
      isFetchingContactInformation ||
      isFetchingProjects ||
      isFetchingAccreditations ||
      isFetchingLicenses ||
      isFetchingCertifications ||
      isFetchingOfficeLocations ||
      isFetchingReferences,
    viewAsClient,
    hasCompletedLogoSection,
    hasCompletedContactInformationSection,
    hasCompletedOtherSections: otherSections.length === completedOtherSectionsCount,
    completionPercentage: Math.floor((completedSectionsCount / TOTAL_SECTION_COUNT) * 100)
  };
};

type Props = ReturnType<typeof mapStateToProps>;

class Completion extends React.Component<Props> {
  render() {
    const {
      isFetching,
      viewAsClient,
      hasCompletedLogoSection,
      hasCompletedContactInformationSection,
      hasCompletedOtherSections,
      completionPercentage
    } = this.props;

    return !viewAsClient &&
      (!hasCompletedLogoSection || !hasCompletedContactInformationSection || !hasCompletedOtherSections) ? (
      <CompletionComponent
        isFetching={isFetching}
        hasCompletedLogoSection={hasCompletedLogoSection}
        hasCompletedContactInformationSection={hasCompletedContactInformationSection}
        hasCompletedOtherSections={hasCompletedOtherSections}
        completionPercentage={completionPercentage}
      />
    ) : null;
  }
}

export const CompletionContainer = connect(mapStateToProps)(Completion);
