import { ActivityAction, ActivityResourceName } from '@pec/aion-ui-core/interfaces/activities';
import { ILinkResult } from 'interfaces/linkResult';
import { TFunction } from 'i18next';

const { Read, Write, Manage } = ActivityAction;
const {
  AuditQuestions,
  Classes,
  CustomerSupport,
  Notifications,
  Organizations,
  OshaViolations,
  QuestionnaireSections,
  Reports,
  Users
} = ActivityResourceName;

export const resolveAuthorizedOptions = (
  hasPermission: (action: ActivityAction, resourceName: ActivityResourceName) => boolean,
  t: TFunction
) =>
  [
    {
      name: t('links.search.authorizedOptions.auditing.title', 'Auditing'),
      results: [
        {
          isAuthorized: hasPermission(Manage, AuditQuestions),
          title: t('links.search.authorizedOptions.auditing.auditorGroupSettings', 'Auditor Group Settings'),
          href: '/SSQV4/Admin/CompanyAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, AuditQuestions),
          title: t('links.search.authorizedOptions.auditing.manageAuditors', 'Manage Auditors'),
          href: '/SSQV4/Admin/UserList.aspx'
        }
      ]
    },
    {
      name: t('links.search.authorizedOptions.misc.title', 'Misc'),
      results: [
        {
          isAuthorized: hasPermission(Read, Classes),
          title: t('links.search.authorizedOptions.misc.classReservations', 'Class Reservations'),
          href: '/classes'
        },
        {
          isAuthorized: hasPermission(Write, CustomerSupport) && !hasPermission(Manage, CustomerSupport),
          title: t('links.search.authorizedOptions.misc.contactManagementSystem', 'Contact Management System'),
          href: '/SSQV4/Dart/TranslateDart.aspx?tp=DartAdminFrameset.htm'
        },
        {
          isAuthorized: hasPermission(Manage, CustomerSupport),
          title: t('links.search.authorizedOptions.misc.CMSAdmin', 'CMS Admin'),
          href: '/SSQV4/Dart/DartReports.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, OshaViolations),
          title: t('links.search.authorizedOptions.misc.OSHAViolations', 'Verify OSHA Violations'),
          href: '/osha-violations'
        },
        {
          isAuthorized: hasPermission(Write, Organizations),
          title: t('links.search.authorizedOptions.misc.newCompany', 'New Company'),
          href: '/SSQV4/Admin/CompanySetup.aspx?AddCompany=yes'
        },
        {
          isAuthorized: hasPermission(Manage, Classes),
          title: t('links.search.authorizedOptions.misc.instructorPortal', 'Instructor Portal'),
          href: '/InstructorPortal'
        },
        {
          isAuthorized: true,
          title: t('links.search.authorizedOptions.misc.trainingTracker', 'Training Tracker'),
          href: '/TRKR/default.aspx'
        }
      ]
    },
    {
      name: t('links.search.authorizedOptions.questionnaire.title', 'Questionnaire'),
      results: [
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.addHyperlink', 'Add Hyperlink'),
          href: '/SSQV4/Admin/HyperLinkAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.categoryAdmin', 'Category Admin'),
          href: '/SSQV4/Admin/CategoryAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.clusterAdmin', 'Cluster Admin'),
          href: '/SSQV4/Admin/QuestionClusterAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.dashboardAdmin', 'Dashboard Admin'),
          href: '/SSQV4/Admin/DashboardAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.documentsForHyperlinks', 'Documents for Hyperlinks'),
          href: '/SSQV4/Admin/DocumentAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editAuditTypes', 'Edit Audit Types'),
          href: '/SSQV4/Admin/AuditTypeAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editCheckBoxChoices', 'Edit Check Box Choices'),
          href: '/SSQV4/Admin/CheckBoxChoiceAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t(
            'links.search.authorizedOptions.questionnaire.editCountriesAndProvinces',
            'Edit Countries and Provinces'
          ),
          href: '/SSQV4/Admin/ProvinceAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editDropDownChoices', 'Edit Drop Down Choices'),
          href: '/SSQV4/Admin/DropDownChoiceAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t(
            'links.search.authorizedOptions.questionnaire.editEMRTabulationColumns',
            'Edit EMR Tabulation Columns'
          ),
          href: '/SSQV4/Admin/EMRTabulationColumnAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editEMRTabulations', 'Edit EMR Tabulations'),
          href: '/SSQV4/Admin/EMRTabulationAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editIncidentColumns', 'Edit Incident Columns'),
          href: '/SSQV4/Admin/IncidentColumnAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editIncidentTabulations', 'Edit Incident Tabulations'),
          href: '/SSQV4/Admin/IncidentTabulationAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editListedOrientation', 'Edit Listed Orientation'),
          href: '/SSQV4/Admin/ListedOrientationAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editListedServices', 'Edit Listed Services'),
          href: '/SSQV4/Admin/ListedServiceAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editListedTraining', 'Edit Listed Training'),
          href: '/SSQV4/Admin/ListedTrainingAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editOrientationTopics', 'Edit Orientation Topics'),
          href: '/SSQV4/Admin/OrientationTopicAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editServiceRegions', 'Edit Service Regions'),
          href: '/SSQV4/Admin/ServiceRegionAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editServices', 'Edit Services'),
          href: '/SSQV4/Admin/ServiceAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t(
            'links.search.authorizedOptions.questionnaire.editTabulationUploadColumns',
            'Edit Tabulation Upload Columns'
          ),
          href: '/SSQV4/Admin/IncidentUploadColumnAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editTrainingColumns', 'Edit Training Columns'),
          href: '/SSQV4/Admin/TrainingColumnAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editTrainingModules', 'Edit Training Modules'),
          href: '/SSQV4/Admin/TrainingModuleAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.editUploadTabulations', 'Edit Upload Tabulations'),
          href: '/SSQV4/Admin/IncidentUploadTabulationAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.priceStructureAdmin', 'Price Structure Admin'),
          href: '/SSQV4/Admin/SubscriptionPricesAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.questionAdmin', 'Question Admin'),
          href: '/SSQV4/Admin/GeneralQuestionAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.sectionAdmin', 'Section Admin'),
          href: '/SSQV4/Admin/QuestionSectionAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t(
            'links.search.authorizedOptions.questionnaire.serviceCategoryMatrixAdmin',
            'Service Category Matrix Admin'
          ),
          href: '/SSQV4/Admin/ServiceCategoryMatrix/ServiceCategoryMatrixListing.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.subscriptionTypeAdmin', 'Subscription Type Admin'),
          href: '/SSQV4/Admin/SubscriptionTypeAdmin.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t(
            'links.search.authorizedOptions.questionnaire.trainingStandardAdministration',
            'Training Standard Administration'
          ),
          href: '/SSQV4/Admin/TrainingStandards/TrainingStandardListing.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, QuestionnaireSections),
          title: t('links.search.authorizedOptions.questionnaire.verificationTypeAdmin', 'Verification Type Admin'),
          href: '/SSQV4/Admin/VerificationAdmin.aspx'
        }
      ]
    },
    {
      name: t('links.search.authorizedOptions.reporting.title', 'Reporting'),
      results: [
        {
          isAuthorized: hasPermission(Write, Reports),
          title: t('links.search.authorizedOptions.reporting.majorRequirementsAdmin', 'Major Requirements Admin'),
          href: '/SSQV4/Admin/MajorContractorRequirements.aspx'
        },
        {
          isAuthorized: hasPermission(Read, Reports) && !hasPermission(Manage, Reports),
          title: t('links.search.authorizedOptions.reporting.reportArchitect', 'Report Architect'),
          href: '/SSQV4/Reports/TranslateReports.aspx?tp=AdminReportsFrameset.htm'
        },
        {
          isAuthorized: hasPermission(Read, Reports),
          title: t('links.search.authorizedOptions.reporting.restrictedReports', 'Restricted Reports'),
          href: '/SSQV4/Reports/RestrictedReports.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, Reports),
          title: t('links.search.authorizedOptions.reporting.standardReportArchitect', 'Standard Report Architect'),
          href: '/SSQV4/Reports/TranslateReports.aspx?tp=StandardReportsFrameset.htm'
        },
        {
          isAuthorized: hasPermission(Write, Reports),
          title: t('links.search.authorizedOptions.reporting.teamCompanyTranslate', 'Team Company Translate'),
          href: '/SSQV4/Admin/TeamTransalteMenu.aspx'
        },
        {
          isAuthorized: hasPermission(Read, Reports) && !hasPermission(Manage, Reports),
          title: t('links.search.authorizedOptions.reporting.viewReports', 'View Reports'),
          href: '/SSQV4/Reports/TranslateReports.aspx?tp=CustomReportsViewerFrameset.htm'
        }
      ]
    },
    {
      name: t('links.search.authorizedOptions.systemNotifications.title', 'System Notifications'),
      results: [
        {
          isAuthorized: hasPermission(Manage, Notifications),
          title: t(
            'links.search.authorizedOptions.systemNotifications.notificationAdminMenu',
            'Notification Admin Menu'
          ),
          href: '/SSQV4/Admin/NotificationAdminMenu.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, Notifications),
          title: t(
            'links.search.authorizedOptions.systemNotifications.promotionalMessageTypeAdmin',
            'Promotional Message Type Admin'
          ),
          href: '/SSQV4/Admin/PromoMessageTypeAdmin.aspx'
        }
      ]
    },
    {
      name: t('links.search.authorizedOptions.users.title', 'Users'),
      results: [
        {
          isAuthorized: hasPermission(Read, Users),
          title: t('links.search.authorizedOptions.users.findUser', 'Find a User'),
          href: '/SSQV4/SSQAdminFindUser.aspx'
        },
        {
          isAuthorized: hasPermission(Manage, Users),
          title: t('links.search.authorizedOptions.users.manageUsers', 'Manage Users'),
          href: '/SSQV4/Admin/UserList.aspx'
        }
      ]
    }
  ]
    .map(category => ({
      ...category,
      results: category.results.filter(({ isAuthorized }: ILinkResult) => isAuthorized)
    }))
    .filter(({ results }) => results.length > 0);
