import { Actions as FetchAccreditationsActions } from 'features/contractor/accreditations/actions';
import { Actions as FetchProjectsActions } from 'features/contractor/projects/actions';
import { Actions as FetchLicensesActions } from 'features/contractor/licenses/actions';
import { Actions as AddLogoActions } from 'features/contractor/logo/actions/addLogo';
import { Actions as FetchLogoActions } from 'features/contractor/logo/actions/fetchLogo';
import { Actions as AddAccreditationActions } from 'features/contractor/accreditation/actions/addAccreditation';
import { Actions as EditAccreditationActions } from 'features/contractor/accreditation/actions/editAccreditation';
import { Actions as DeleteAccreditationActions } from 'features/contractor/accreditation/actions/deleteAccreditation';
import { Actions as FetchContactInformationActions } from 'features/contractor/contactInformation/actions/fetchContactInformation';
import { Actions as AddContactInformationActions } from 'features/contractor/contactInformation/actions/addContactInformation';
import { Actions as FetchCertificationsActions } from 'features/contractor/certifications/actions';
import { Actions as FetchReferencesActions } from 'features/contractor/references/actions';
import { Actions as AddProjectActions } from 'features/contractor/project/actions/addProject';
import { Actions as DeleteProjectActions } from 'features/contractor/project/actions/deleteProject';
import { Actions as EditContactInformationActions } from 'features/contractor/contactInformation/actions/editContactInformation';
import { Actions as EditProjectActions } from 'features/contractor/project/actions/editProject';
import { Actions as UpdateOrganizationActions } from 'features/contractor/organizationDescription/actions/updateOrganizationDescription';
import { Actions as AddLicenseActions } from 'features/contractor/license/actions/addLicense';
import { Actions as EditLicenseActions } from 'features/contractor/license/actions/editLicense';
import { Actions as DeleteLicenseActions } from 'features/contractor/license/actions/deleteLicense';
import { Actions as AddCertificationActions } from 'features/contractor/certification/actions/addCertification';
import { Actions as EditCertificationActions } from 'features/contractor/certification/actions/editCertification';
import { Actions as DeleteCertificationActions } from 'features/contractor/certification/actions/deleteCertification';
import { Actions as AddReferenceActions } from 'features/contractor/reference/actions/addReference';
import { Actions as EditReferenceActions } from 'features/contractor/reference/actions/editReference';
import { Actions as DeleteReferenceActions } from 'features/contractor/reference/actions/deleteReference';
import { Actions as AddPhotoGalleryImageActions } from 'features/contractor/photoGallery/actions/addPhotoGalleryImage';
import { Actions as FetchPhotoGalleryMetaDataActions } from 'features/contractor/photoGallery/metaData/actions';
import { Actions as DeletePhotoGalleryImageActions } from 'features/contractor/photoGallery/actions/deletePhotoGalleryImage';
import { Actions as FetchPhotoGalleryImagesActions } from 'features/contractor/photoGallery/actions/fetchPhotoGalleryImages';
import { Actions as FetchPhotoGalleryThumbnailsActions } from 'features/contractor/photoGallery/actions/fetchPhotoGalleryThumbnails';
import { Actions as FetchOfficeLocationsActions } from 'features/contractor/officeLocations/actions';
import { Actions as AddOfficeLocationActions } from 'features/contractor/officeLocation/actions/addOfficeLocation';
import { Actions as EditOfficeLocationActions } from 'features/contractor/officeLocation/actions/editOfficeLocation';
import { Actions as DeleteOfficeLocationActions } from 'features/contractor/officeLocation/actions/deleteOfficeLocation';
import { Actions as AddAnnouncementActions } from 'features/contractor/announcements/actions/addAnnouncement';
import { Actions as EditAnnouncementActions } from 'features/contractor/announcements/actions/editAnnouncement';
import { Actions as DeleteAnnouncementActions } from 'features/contractor/announcements/actions/deleteAnnouncement';
import { Actions as FetchAnnouncementActions } from 'features/contractor/announcements/actions/fetchAnnouncement';
import { Actions as SetCoverPhotoActions } from 'features/contractor/photoGallery/coverPhoto/actions/setCoverPhoto';
import { Actions as ToggleViewActions } from 'features/contractor/profile/actions';
import { Actions as FetchCoverPhotoActions } from 'features/contractor/photoGallery/coverPhoto/actions/fetchCoverPhoto';
import { Actions as FetchContractorOrganizationActions } from 'features/client/contractorOrganization/actions';
import { Actions as FetchSearchResultsActions } from 'features/client/searchContractors/actions/fetchSearchResults';
import { Actions as FetchTradeNamesActions } from 'features/contractor/tradeNames/actions';
import { Actions as AddTradeNameActions } from 'features/contractor/tradeName/actions/addTradeName';
import { Actions as EditTradeNameActions } from 'features/contractor/tradeName/actions/editTradeName';
import { Actions as DeleteTradeNameActions } from 'features/contractor/tradeName/actions/deleteTradeName';
import { Actions as FetchSearchResultLogoActions } from 'features/client/searchContractors/actions/fetchSearchResultLogo';
import { RootActions as CommonRootActions } from '@pec/aion-ui-core/combineActions';

type AccreditationActions =
  | AddAccreditationActions
  | DeleteAccreditationActions
  | EditAccreditationActions
  | FetchAccreditationsActions;

type TradeNameActions = AddTradeNameActions | DeleteTradeNameActions | EditTradeNameActions | FetchTradeNamesActions;

type AnnouncementActions =
  | AddAnnouncementActions
  | DeleteAnnouncementActions
  | EditAnnouncementActions
  | FetchAnnouncementActions;

type ContactInformationActions =
  | AddContactInformationActions
  | EditContactInformationActions
  | FetchContactInformationActions;

type ContractorOrganizationActions = FetchContractorOrganizationActions;

type CertificationActions =
  | AddCertificationActions
  | DeleteCertificationActions
  | EditCertificationActions
  | FetchCertificationsActions;

type LicenseActions = AddLicenseActions | DeleteLicenseActions | EditLicenseActions | FetchLicensesActions;

type LogoActions = AddLogoActions | FetchLogoActions;

type OfficeLocationActions =
  | AddOfficeLocationActions
  | DeleteOfficeLocationActions
  | EditOfficeLocationActions
  | FetchOfficeLocationsActions;

type ProjectActions = AddProjectActions | DeleteProjectActions | EditProjectActions | FetchProjectsActions;

type PhotoGalleryImageActions =
  | AddPhotoGalleryImageActions
  | DeletePhotoGalleryImageActions
  | FetchCoverPhotoActions
  | FetchPhotoGalleryImagesActions
  | FetchPhotoGalleryThumbnailsActions
  | SetCoverPhotoActions
  | FetchPhotoGalleryMetaDataActions;

type ReferenceActions = AddReferenceActions | DeleteReferenceActions | EditReferenceActions | FetchReferencesActions;

type ProfileActions = ToggleViewActions | UpdateOrganizationActions;

type SearchResultsActions = FetchSearchResultsActions | FetchSearchResultLogoActions;

export type RootActions =
  | AccreditationActions
  | TradeNameActions
  | AnnouncementActions
  | CommonRootActions
  | ContactInformationActions
  | ContractorOrganizationActions
  | CertificationActions
  | LicenseActions
  | LogoActions
  | OfficeLocationActions
  | ProjectActions
  | PhotoGalleryImageActions
  | ReferenceActions
  | ProfileActions
  | SearchResultsActions;
