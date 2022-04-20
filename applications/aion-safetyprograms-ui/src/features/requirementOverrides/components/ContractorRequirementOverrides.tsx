import React from 'react';
import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useTranslation } from 'react-i18next';
import { localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { ErrorButton } from 'components/ErrorButton';
import { getClientOverrideStatusGridDisplayValue } from 'helpers/getStatusDisplayValues';
import { deleteRequirementOverride } from '../actions/deleteRequirementOverride';
import { RootState } from 'combineReducers';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { IContractorRequirement } from 'interfaces/requirement';
import { DeepReadonly } from 'utility-types/dist/mapped-types';
import { IClientRequirementOverride } from 'interfaces/requirementOverride';

type Props = {
  overrideRequest:
    | DeepReadonly<{
        id: string;
        safetyProgramRequirementId: string;
        comment: string;
        isActive: boolean;
        contractorCompanyNumber: number;
        contractorName: string;
        safetyProgramName: string;
        contractorId: string;
        clientOverrides: IClientRequirementOverride[];
        createdBy: string;
        createdDateUtc: string;
      }>
    | undefined;
  previousPath: string;
  requirement: DeepReadonly<IContractorRequirement>;
};

export const ContractorRequirementOverrides: React.FC<Props> = ({ overrideRequest, previousPath, requirement }) => {
  const [deleteRequest, setDeleteRequest] = React.useState(false);
  const dispatch = useDispatch();
  const classes = useSharedTableStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const { userInfo } = useSelector((state: RootState) => state.userInfo);

  const onCancelRequest = async (id: string) => {
    if (userInfo) {
      await Promise.resolve(dispatch(deleteRequirementOverride(id)));
      history.push(previousPath);
    }
  };

  return (
    <>
      <GridContainer>
        <Grid item xs={12} sm={4}>
          <Grid item>
            <Typography variant="h6">
              {t('safetyPrograms.requirementOverrides.requirementExceptions', {
                requirement: requirement?.safetyProgramTitle,
                defaultValue: '{{requirement}} Exceptions'
              })}
            </Typography>
          </Grid>
          <Box p={1}>
            <Box ml={1.6} mt={2} mb={2} borderLeft={3} borderColor="primary.main">
              {overrideRequest && (
                <Box pl={2}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {overrideRequest.createdBy} · {localizeDateTime(overrideRequest.createdDateUtc, t)}
                  </Typography>
                  <Typography>{overrideRequest.comment}</Typography>
                </Box>
              )}
            </Box>
            <GridContainer>
              <Grid item>
                <ErrorButton onClick={() => setDeleteRequest(true)}>
                  {t('safetyPrograms.requirementOverrides.cancelRequest', 'Cancel Request')}
                </ErrorButton>
              </Grid>
            </GridContainer>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Table className={classes.dividedTable}>
            <TableHead>
              <TableRow>
                <TableCell>{t('safetyPrograms.common.clients', 'Clients')}</TableCell>
                <TableCell>{t('safetyPrograms.common.status', 'Status')}</TableCell>
                <TableCell align="right">{t('safetyPrograms.common.comments', 'Comments')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {overrideRequest && overrideRequest.clientOverrides.length > 0
                ? overrideRequest.clientOverrides.map(x => {
                    return (
                      <TableRow key={x.id}>
                        <TableCell>{x.clientName}</TableCell>
                        <TableCell>{getClientOverrideStatusGridDisplayValue(x.status, t)}</TableCell>
                        <TableCell>{x.comment}</TableCell>
                      </TableRow>
                    );
                  })
                : null}
            </TableBody>
          </Table>
        </Grid>
      </GridContainer>
      <Dialog open={deleteRequest}>
        <DialogTitle>
          {t('safetyPrograms.requirementOverrides.cancelExceptionRequest', 'Cancel Exception Request')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'safetyPrograms.requirementOverrides.cancelExceptionRequestNote',
              'By canceling this request, all current and future clients will no longer see an active request. NOTE: Any exceptions already granted by individual clients will not be affected by this cancellation request. Please contact Veriforce at 866-647-2338 for questions.'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setDeleteRequest(false)}>
            {t('safetyPrograms.common.cancel', 'Cancel')}
          </Button>
          {overrideRequest && (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                onCancelRequest(overrideRequest.id);
                setDeleteRequest(false);
              }}
            >
              {t('safetyPrograms.requirementOverrides.yesCancelRequest', 'Yes, Cancel Request')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
