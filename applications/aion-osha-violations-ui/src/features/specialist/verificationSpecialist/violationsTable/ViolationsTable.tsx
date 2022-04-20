import * as React from 'react';
import { CurrentStatus } from 'interfaces/oshaViolations';
import { currentViolation } from 'helpers/currentViolation';
import { Error } from '@pec/aion-ui-components/components/Error';
import { getHeadersTooltips } from 'helpers/tooltips';
import { ITableHeader } from '@pec/aion-ui-components/interfaces/tableHeader';
import { Link } from '@pec/aion-ui-components/components/Link';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { mapOshaViolations } from 'helpers/mapViolations';
import { merge } from '@pec/aion-ui-core/helpers/querystring';
import { TableComponent } from 'common/components/TableComponent';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { useTable } from 'common/hooks/useTable';
import { useTypedSelector } from 'app/reducer';
import { useTranslation } from 'react-i18next';

export const ViolationsTable: React.FC = () => {
  const { status } = useParams<{ status: CurrentStatus }>();
  const { handlePageChange, handleRowsPerPage, handleSortChange, order, orderBy, currentPage, pageSize } = useTable();
  const pendingViolations = useTypedSelector(state => state.pendingViolations);
  const associatedViolations = useTypedSelector(state => state.associatedViolations);
  const unassociatedViolations = useTypedSelector(state => state.unassociatedViolations);
  const unMatchedViolations = useTypedSelector(state => state.unMatchedViolations);
  const history = useHistory();
  const { t } = useTranslation();

  const { error, isFetching, total, violations } = currentViolation({
    unMatchedViolations,
    associatedViolations,
    pendingViolations,
    unassociatedViolations,
    status
  });

  const headersTooltips = getHeadersTooltips(t);

  const getHeaders = (): ITableHeader[] => [
    {
      id: 'oshaCompanyName',
      label:
        status === 'associated'
          ? t('oshaViolations.common.veriforceCompanyName', 'Veriforce Company Name')
          : t('oshaViolations.common.oshaCompanyName', 'OSHA Company Name'),
      columnWidth: '15%',
      tooltip: headersTooltips.oshaCompanyName
    },
    {
      id: `${status === 'associated' ? 'SSQID' : ''}`,
      label: `${status === 'associated' ? t('oshaViolations.common.ssqid', 'SSQID') : ''}`,
      tooltip: headersTooltips.SSQID
    },
    { id: 'state', label: t('oshaViolations.common.state', 'State'), tooltip: headersTooltips.state },
    { id: 'activity', label: t('oshaViolations.common.activity', 'Activity'), tooltip: headersTooltips.activity },
    {
      id: 'citationId',
      label: t('oshaViolations.common.citationId', 'Citation ID'),
      tooltip: headersTooltips.citationId
    },
    { id: 'violationType', label: t('oshaViolations.common.type', 'Type'), tooltip: headersTooltips.violationType },
    {
      id: 'opened',
      label: t('oshaViolations.common.opened', 'Opened'),
      columnWidth: '8%',
      tooltip: headersTooltips.opened
    },
    {
      id: 'closedDate',
      label: t('oshaViolations.common.closed', 'Closed'),
      isSortable: true,
      columnWidth: '8%',
      tooltip: headersTooltips.closed
    },
    {
      id: 'importedDateUtc',
      label: t('oshaViolations.common.imported', 'Imported'),
      isSortable: true,
      columnWidth: '10%',
      tooltip: headersTooltips.imported
    },
    {
      id: `${status === 'associated' ? 'match' : ''}`,
      label: `${status === 'associated' ? t('oshaViolations.common.match', 'Match') : ''}`,
      columnWidth: '8%',
      tooltip: headersTooltips.match
    },
    { id: 'view', label: '' }
  ];
  const handleViewClick = (id: string, name: string) => {
    const {
      location: { search }
    } = history;

    history.push({
      pathname: `/osha-violations/details/${status ? status : 'pending'}`,
      search: merge(search, { name: name, id: id })
    });
  };

  const violationLink = (id: string, name: string) => (
    <Link style={{ textDecoration: 'none' }} onClick={() => handleViewClick(id, name)}>
      {t('oshaViolations.common.view', 'View')}
    </Link>
  );

  return (
    <React.Fragment>
      {!isFetching && violations ? (
        <TableComponent
          headers={getHeaders()}
          options={mapOshaViolations(violations, violationLink, t)}
          handlePageChange={handlePageChange}
          order={order}
          orderBy={(orderBy as string) || 'importedDateUtc'}
          page={currentPage}
          pageSize={pageSize}
          handleSortChange={handleSortChange}
          isFetchingData={isFetching}
          totalOptionsCount={total}
          handleChangeRowsPerPage={handleRowsPerPage}
          onClick={handleViewClick}
          pageSizes={[10, 25, 50, 100]}
        />
      ) : error ? (
        <Error message={t('oshaViolations.common.thereWasAnError', 'There was an error processing your request.')} />
      ) : (
        <Loading />
      )}
    </React.Fragment>
  );
};
