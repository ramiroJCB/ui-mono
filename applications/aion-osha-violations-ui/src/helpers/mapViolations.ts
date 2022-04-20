import { IOshaViolations } from 'interfaces/oshaViolations';
import { OshaLink } from 'common/components/OshaLink';
import { oshaRatio } from './oshaRatio';
import { IViolationsTableOption } from 'interfaces/violationsTableOption';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';
import { TFunction } from 'i18next';
import { localizeUTCDate } from './dates';

export const mapOshaViolations = (violations: IOshaViolations[], violationLink: any, t: TFunction) =>
  violations.map(
    ({
      id,
      importedDateUtc,
      oshaCompanyName,
      citationId,
      activityNumber,
      violationType,
      openedDate,
      closedDate,
      naicsCode,
      state,
      associatedMatchPercentage,
      associatedCompanyName,
      associatedCompanyNumber
    }) => {
      return {
        id: id,
        SSQID: associatedCompanyNumber && associatedCompanyNumber,
        oshaCompanyName: associatedCompanyName ? associatedCompanyName : oshaCompanyName,
        importedDateUtc: importedDateUtc ? localizeUTCDate(importedDateUtc, t) : '',
        citationId: citationId,
        activity: OshaLink(activityNumber),
        violationType: violationType,
        opened: openedDate ? localizeDate(openedDate, t) : '',
        closedDate: closedDate ? localizeDate(closedDate, t) : '',
        naics: naicsCode ? naicsCode.toString() : '',
        state: state,
        match: associatedMatchPercentage && oshaRatio(associatedMatchPercentage) + ' %',
        view: violationLink(id, associatedCompanyName ? associatedCompanyName : oshaCompanyName)
      } as IViolationsTableOption;
    }
  );
