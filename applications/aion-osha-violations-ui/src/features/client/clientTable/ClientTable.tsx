import * as React from 'react';
import { ClientTableComponent } from './clientTableComponent/ClientTableComponent';
import { Error } from '@pec/aion-ui-components/components/Error';
import { IOshaViolations } from 'interfaces/oshaViolations';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OshaLink } from 'common/components/OshaLink';
import { useTypedSelector } from 'app/reducer';
import { useTable } from 'common/hooks/useTable';
import { useTranslation } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const violationTypes = {
  S: 'Serious',
  W: 'Willful',
  R: 'Repeat',
  O: 'Other'
};

export const ClientTable: React.FC = () => {
  const { violations, isFetching, error, total } = useTypedSelector(state => state.clientViolations);
  const { handlePageChange, handleRowsPerPage, currentPage, pageSize } = useTable();
  const { t } = useTranslation();

  const getHeaders = (): ITableHeader[] => [
    {
      id: 'associatedCompanyName',
      label: t('oshaViolations.common.veriforceCompanyName', 'Veriforce Company Name'),
      columnWidth: '25%'
    },
    {
      id: 'citationId',
      label: t('oshaViolations.common.citationId', 'Citation ID'),
      columnWidth: '15%'
    },
    { id: 'activityNumber', label: t('oshaViolations.common.activity', 'Activity'), columnWidth: '15%' },
    {
      id: 'openedDate',
      label: t('oshaViolations.common.opened', 'Opened'),
      columnWidth: '15%'
    },
    {
      id: 'closedDate',
      label: t('oshaViolations.common.closed', 'Closed'),
      columnWidth: '15%'
    },
    { id: 'violationType', label: t('oshaViolations.common.type', 'Type'), columnWidth: '15%' }
  ];

  const clientViolations = (violations: IOshaViolations[]) =>
    violations.map(
      ({ id, citationId, activityNumber, violationType, openedDate, closedDate, state, associatedCompanyName }) => {
        return {
          id,
          citationId,
          violationType: violationTypes[violationType],
          state,
          associatedCompanyName: associatedCompanyName,
          activityNumber: OshaLink(activityNumber),
          openedDate: openedDate ? localizeDate(openedDate, t) : '',
          closedDate: closedDate ? localizeDate(closedDate, t) : ''
        };
      }
    );

  return !isFetching && violations ? (
    <ClientTableComponent
      headers={getHeaders()}
      options={clientViolations(violations)}
      handlePageChange={handlePageChange}
      order="desc"
      orderBy="closedDate"
      page={currentPage}
      pageSize={pageSize}
      isFetchingData={isFetching}
      totalOptionsCount={total}
      handleChangeRowsPerPage={handleRowsPerPage}
      pageSizes={[10, 25, 50, 100]}
    />
  ) : error ? (
    <Error message={t('oshaViolations.common.thereWasAnError', 'There was an error processing your request.')} />
  ) : (
    <Loading />
  );
};
