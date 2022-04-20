import { combineReducers } from 'redux';
import { commonRootReducer, CommonRootState } from '@pec/aion-ui-core/combineReducers';
import {
  reducer as contactInformation,
  State as ContactInformationState
} from 'features/contractor/contactInformation/reducer';
import { reducer as projects, State as ProjectsState } from 'features/contractor/projects/reducer';
import { reducer as project, State as ProjectState } from 'features/contractor/project/reducer';
import { reducer as licenses, State as LicensesState } from 'features/contractor/licenses/reducer';
import { reducer as license, State as LicenseState } from 'features/contractor/license/reducer';
import { reducer as logo, State as LogoState } from 'features/contractor/logo/reducer';
import { reducer as accreditation, State as AccreditationState } from 'features/contractor/accreditation/reducer';
import { reducer as accreditations, State as AccreditationsState } from 'features/contractor/accreditations/reducer';
import { reducer as certifications, State as CertificationsState } from 'features/contractor/certifications/reducer';
import { reducer as certification, State as CertificationState } from 'features/contractor/certification/reducer';
import { reducer as references, State as ReferencesState } from 'features/contractor/references/reducer';
import { reducer as reference, State as ReferenceState } from 'features/contractor/reference/reducer';
import { reducer as officeLocations, State as OfficeLocationsState } from 'features/contractor/officeLocations/reducer';
import { reducer as officeLocation, State as OfficeLocationState } from 'features/contractor/officeLocation/reducer';
import { reducer as photoGallery, State as PhotoGalleryState } from 'features/contractor/photoGallery/reducer';
import {
  reducer as photoGalleryMetaData,
  State as PhotoGalleryMetaDataState
} from 'features/contractor/photoGallery/metaData/reducer';
import {
  reducer as photoGalleryCoverPhoto,
  State as PhotoGalleryCoverPhotoState
} from 'features/contractor/photoGallery/coverPhoto/reducer';
import { reducer as announcement, State as AnnouncementState } from 'features/contractor/announcements/reducer';
import { reducer as searchResults, State as SearchResultsState } from 'features/client/searchContractors/reducer';
import { reducer as tradeName, State as TradeNameState } from 'features/contractor/tradeName/reducer';
import { reducer as tradeNames, State as TradeNamesState } from 'features/contractor/tradeNames/reducer';
import {
  reducer as contractorOrganization,
  State as ContractorOrganizationState
} from 'features/client/contractorOrganization/reducer';
import { reducer as profile, State as ProfileState } from 'features/contractor/profile/reducer';
import { RootActions } from 'combineActions';

type AppRootState = {
  accreditation: AccreditationState;
  accreditations: AccreditationsState;
  tradeName: TradeNameState;
  tradeNames: TradeNamesState;
  announcement: AnnouncementState;
  certification: CertificationState;
  certifications: CertificationsState;
  contractorOrganization: ContractorOrganizationState;
  contactInformation: ContactInformationState;
  license: LicenseState;
  licenses: LicensesState;
  logo: LogoState;
  officeLocation: OfficeLocationState;
  officeLocations: OfficeLocationsState;
  profile: ProfileState;
  project: ProjectState;
  projects: ProjectsState;
  photoGallery: PhotoGalleryState;
  photoGalleryCoverPhoto: PhotoGalleryCoverPhotoState;
  photoGalleryMetaData: PhotoGalleryMetaDataState;
  reference: ReferenceState;
  references: ReferencesState;
  searchResults: SearchResultsState;
};

export type RootState = AppRootState & CommonRootState;

export const rootReducer = combineReducers<RootState, RootActions>({
  ...commonRootReducer,
  accreditation,
  accreditations,
  tradeName,
  tradeNames,
  announcement,
  certification,
  certifications,
  contactInformation,
  contractorOrganization,
  license,
  licenses,
  logo,
  profile,
  project,
  projects,
  photoGallery,
  photoGalleryCoverPhoto,
  photoGalleryMetaData,
  officeLocation,
  officeLocations,
  reference,
  references,
  searchResults
});
