import * as React from 'react';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { AxiosError } from 'axios';
import { CommentsBadge } from 'components/CommentsBadge';
import { DeepReadonly } from 'utility-types';
import { IExpandedRequirement } from 'interfaces/requirement';
import { LinkedRow } from '@pec/aion-ui-components/components/LinkedRow';
import { RequirementStatusComponent } from 'features/requirement/components/Status';
import { sortGracePeriodEffectiveDates } from 'helpers/sortGracePeriodEffectiveDates';
import { TooltipList } from 'components/TooltipList';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { getClientExceptions } from 'helpers/getClientExceptions';
import { useTranslation } from 'react-i18next';
import { localizeDate, localizeDateTime, localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  requirements: DeepReadonly<IExpandedRequirement[]> | null;
  total: number | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  organizationId: string;
  onChangePage: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => void;
  page: number;
  rowsPerPage: number;
};

export const ContractorRequirementsComponent: React.FC<Props> = ({
  requirements,
  total,
  isFetching,
  error,
  organizationId,
  onChangePage,
  page,
  rowsPerPage
}) => {
  const classes = useSharedTableStyles();
  const { t } = useTranslation();

  return (
    <Paper hasError={!!error} isLoading={isFetching}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableCell}>
              {t('safetyPrograms.common.programName', 'Program Name')}
            </TableCell>
            <TableCell className={classes.tableCell}>{t('safetyPrograms.common.status', 'Status')}</TableCell>
            <TableCell align="center" className={classes.tableCell}>
              {t('safetyPrograms.common.comments', 'Comments')}
            </TableCell>
            <TableCell align="center" className={classes.tableCell}>
              {t('safetyPrograms.common.clients', 'Clients')}
            </TableCell>
            <TableCell className={classes.tableCell}>
              {t('safetyPrograms.common.gracePeriodEnd', 'Grace Period End')}
            </TableCell>
            <TableCell className={classes.tableCell}>
              {t('safetyPrograms.common.lastActivity', 'Last Activity')}
            </TableCell>
            <TableCell align="center" className={classes.tableCell}>
              {t('safetyPrograms.common.exceptionsGranted', 'Exceptions Granted')}
            </TableCell>
            <TableCell align="center" className={classes.tableCell}>
              {t('safetyPrograms.common.view', 'View')}
            </TableCell>
          </TableRow>
        </TableHead>
        {requirements && (
          <TableBody>
            {requirements.length > 0 ? (
              requirements.map(
                ({
                  id,
                  safetyProgramTitle,
                  status,
                  clients,
                  clientScoreOverrides,
                  clientGracePeriods,
                  lastContractorActivityDateUtc,
                  hasUnreadEvaluatorComments,
                  numberOfComments
                }) => {
                  const date = lastContractorActivityDateUtc && new Date(lastContractorActivityDateUtc);
                  const clientExceptions = getClientExceptions(clientScoreOverrides, clients);
                  const clientsWithGracePeriods = sortGracePeriodEffectiveDates(
                    clientGracePeriods.filter(
                      ({ effectiveGracePeriod, gracePeriodExpirationDateForClient }) =>
                        effectiveGracePeriod !== null || gracePeriodExpirationDateForClient !== null
                    ),
                    'desc'
                  );

                  return (
                    <LinkedRow key={id} to={`/organizations/${organizationId}/safety-program-requirements/${id}`}>
                      <TableCell>{safetyProgramTitle}</TableCell>
                      <TableCell>
                        <RequirementStatusComponent status={status} />
                      </TableCell>
                      <TableCell align="center">
                        <CommentsBadge
                          hasUnreadComments={hasUnreadEvaluatorComments}
                          numberOfComments={numberOfComments}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <TooltipList
                          placement="right"
                          items={clients.map(({ id, name }) => ({
                            id,
                            name
                          }))}
                        >
                          <React.Fragment>{localizeNumber(clients.length, t)}</React.Fragment>
                        </TooltipList>
                      </TableCell>
                      <TableCell>
                        {clientsWithGracePeriods.length > 1
                          ? t('safetyPrograms.common.multiple', 'Multiple')
                          : clientsWithGracePeriods[0] &&
                            clientsWithGracePeriods[0].effectiveGracePeriod &&
                            localizeDate(clientsWithGracePeriods[0].effectiveGracePeriod, t)}
                      </TableCell>
                      <TableCell title={date ? localizeDateTime(date, t) : undefined}>
                        {date && localizeDate(date, t)}
                      </TableCell>
                      <TableCell align="center">
                        {clientExceptions.length > 0 ? (
                          <TooltipList placement="right" items={clientExceptions}>
                            <React.Fragment>{localizeNumber(clientExceptions.length, t)}</React.Fragment>
                          </TooltipList>
                        ) : (
                          0
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <ChevronRightIcon color="action" />
                      </TableCell>
                    </LinkedRow>
                  );
                }
              )
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {t(
                    'safetyPrograms.requirements.noSafetyProgramsAssigned',
                    'No Program Reviews have been assigned to this organization.'
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        )}
        {total !== null && (
          <TableFooter>
            <TableRow>
              <TablePagination
                className={classes.pagination}
                style={{ borderBottom: 0 }}
                count={total}
                onChangePage={onChangePage}
                page={page}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[]}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </Paper>
  );
};
