import { TFunction } from 'i18next';

export function getHeadersTooltips(t: TFunction) {
  return {
    SSQID: t('oshaViolations.tooltips.companyId', 'Company ID'),
    oshaCompanyName: t('oshaViolations.tooltips.establishmentBeingInspected', 'Establishment being inspected'),
    state: t('oshaViolations.tooltips.stateOfEstablishment', "State of establishment's mailing address"),
    activity: t('oshaViolations.tooltips.oshaDataFeed', 'OSHA data feed identifier for the inspection'),
    citationId: t(
      'oshaViolations.tooltips.identifiesTheCitation',
      'Identifies the citation number, item number, and item group of the issued citation'
    ),
    violationType: t('oshaViolations.tooltips.seriousWillfulRepeatOther', 'S=Serious, W=Willful, R=Repeat, O=Other'),
    naics: t('oshaViolations.tooltips.uniqueCodeThat', 'Unique code that is assigned to the NAICS'),
    opened: t('oshaViolations.tooltips.indicatesInspectionStarted', 'Indicates when the inspection was started'),
    closed: t('oshaViolations.tooltips.indicatesInspectionClosed', 'Indicates when the inspection was closed'),
    imported: t('oshaViolations.tooltips.dateDataWasImported', 'Date data was imported'),
    attestedOn: t('oshaViolations.tooltips.dateViolationWasAttested', 'Date violation was attested by establishment'),
    match: t('oshaViolations.tooltips.programmaticMatchingPercentage', 'Programmatic matching percentage')
  };
}

export function getTabsTooltips(t: TFunction) {
  return {
    Pending: t(
      'oshaViolations.tooltips.violationsRequireVerificationTeam',
      'Violations that require verification team review'
    ),
    Associated: t(
      'oshaViolations.tooltips.violationsHaveBeenAutomatically',
      'Violations that have been automatically or manually matched with a company in Compliance Pro'
    ),
    Unassociated: t(
      'oshaViolations.tooltips.violationsOriginallyHadPartial',
      'Violations that originally had at least a partial match to a Compliance Pro company and have been manually reviewed with no matching company found'
    ),
    Other: t(
      'oshaViolations.tooltips.violationsDoNotHaveCompanyMatch',
      'Violations that do not have a company match in Compliance Pro due to not meeting the matching threshold'
    )
  };
}
