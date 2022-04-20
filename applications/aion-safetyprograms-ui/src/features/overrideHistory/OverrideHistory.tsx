import React, { useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@material-ui/core';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'combineReducers';
import { fetchOverrideHistory } from './actions/fetchOverrideHistory';
import { CircularProgress } from '@pec/aion-ui-components/components/CircularProgress';
import { useTranslation } from 'react-i18next';
import { localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';
import { getOverrideHistoryActionType } from '../../helpers/getOverrideHistoryActionType';

type Props = {
  requirementId: string;
  clientId?: string;
};

export const OverrideHistory: React.FC<Props> = ({ clientId, requirementId }) => {
  const classes = useSharedTableStyles();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { overrideHistory, isFetching } = useSelector((state: RootState) => state.overrideHistory);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchOverrideHistory(requirementId, clientId));
    } else {
      dispatch(fetchOverrideHistory(requirementId));
    }
  }, [clientId, dispatch, requirementId]);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell className={classes.tableCell}>{t('safetyPrograms.overrideHistory.company', 'Company')}</TableCell>
          <TableCell className={classes.tableCell} align="left">
            {t('safetyPrograms.overrideHistory.user', 'User')}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {t('safetyPrograms.overrideHistory.actions', 'Actions')}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {t('safetyPrograms.common.comment', 'Comment')}
          </TableCell>
          <TableCell className={classes.tableCell} align="left">
            {t('safetyPrograms.overrideHistory.dateTime', 'Date/Time')}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {isFetching ? (
          <TableRow style={{ height: 150 }}>
            <TableCell className={classes.tableCell} align="center" colSpan={5}>
              <CircularProgress />
            </TableCell>
          </TableRow>
        ) : overrideHistory ? (
          overrideHistory.map(history => (
            <TableRow key={history.id}>
              <TableCell>{history.organizationName}</TableCell>
              <TableCell>{history.username}</TableCell>
              <TableCell>{getOverrideHistoryActionType(history.actionType, t)}</TableCell>
              <TableCell>{history.comment}</TableCell>
              <TableCell>{localizeDateTime(history.dateUtc, t)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow style={{ height: 150 }}>
            <TableCell colSpan={5}>
              <Typography color="primary" variant="h5" align="center">
                {t('safetyPrograms.overrideHistory.noDataFound', 'No data found')}
              </Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
