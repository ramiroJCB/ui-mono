import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { clearUrl } from 'helpers/clearUrl';
import { CurrentStatus } from 'interfaces/oshaViolations';
import { enqueueRequestErrorSnackbar, enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { Field, Form } from 'react-final-form';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { unwrapResult } from '@reduxjs/toolkit';
import { updateViolation } from 'features/specialist/violationDetails/updateViolation/slice';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { operationConfirmation } from 'helpers/confirmationOperation';
import { useTranslation } from 'react-i18next';
import { getActionLabel } from '../utils';

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    color: theme.palette.primary.main
  }
}));

const actions = {
  associate: 'Associated',
  unassociate: 'Unassociated',
  flagForReview: 'Pending'
};

const operations = {
  associate: 'Associate',
  moveToPending: 'Move To Pending',
  unassociate: 'Unassociate'
};

const operationOptions = {
  pending: [operations.associate, operations.unassociate],
  associated: [operations.moveToPending, operations.unassociate],
  unassociated: [operations.moveToPending, operations.associate],
  other: [operations.moveToPending, operations.associate]
};

interface IReasonForAction {
  reasonForAction: string;
}

export const ManualOperations: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { isFetching: isFetchingUpdatedViolation } = useTypedSelector(state => state.updatedViolation);
  const { isFetching: isFetchingOsha } = useTypedSelector(state => state.oshaViolation);
  const { isFetching: isFetchingOrganizationViolations } = useTypedSelector(state => state.organizationViolations);
  const { status } = useParams<{ status: CurrentStatus }>();
  const history = useHistory();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [currentAction, setCurrentAction] = React.useState('');
  const { t } = useTranslation();

  const isFetching = isFetchingOsha || isFetchingOrganizationViolations;
  const {
    location: { search }
  } = useHistory();

  const { organizationId, organizationViolationsId, id } = parse(search) as {
    organizationId: string;
    organizationViolationsId: string;
    id: string;
  };
  const selected = organizationId || organizationViolationsId;

  const notificationContent = (citationId: string, activityNumber: number, action: string): any =>
    t('oshaViolations.manualOps.citationForActivity', {
      defaultValue: 'Citation {{citationId}} for Activity {{activityNumber}} has been moved to {{actionLabel}}',
      citationId,
      activityNumber,
      actionLabel: getActionLabel(actions[action], t)
    });

  const getOperationLabel = (operation: string): string => {
    switch (operation) {
      case operations.associate:
        return t('oshaViolations.manualOps.associate', 'Associate');
      case operations.moveToPending:
        return t('oshaViolations.manualOps.moveToPending', 'Move to Pending');
      case operations.unassociate:
      default:
        return t('oshaViolations.manualOps.unassociate', 'Unassociate');
    }
  };

  const getDialogTitle = (action: string): string => {
    switch (action) {
      case operations.associate:
        return t('oshaViolations.manualOps.moveToAssociate', 'Move to Associate');
      case operations.unassociate:
        return t('oshaViolations.manualOps.moveToUnassociate', 'Move to Unassociate');
      default:
        return t('oshaViolations.manualOps.moveToPending', 'Move to Pending');
    }
  };

  const handleClearClick = () => {
    history.push({
      pathname: `/osha-violations/${status ?? 'pending'}`,
      search: clearUrl(search, true)
    });
  };

  const handleOperations = async (values: IReasonForAction) => {
    try {
      const { reasonForAction } = values;

      const action = [operations.associate, operations.unassociate].includes(currentAction)
        ? currentAction.toLowerCase()
        : 'flagForReview';

      const response = await dispatch(
        updateViolation({
          organizationId: organizationId && organizationId,
          organizationViolationsId: organizationViolationsId && organizationViolationsId,
          action: action,
          reasonForAction: reasonForAction,
          id: id
        })
      );
      const { data } = await unwrapResult(response);

      history.push({
        pathname: `/osha-violations/${status ?? 'pending'}`,
        search: clearUrl(search)
      });

      dispatch(
        enqueueSnackbar({
          message: notificationContent(data.citationId, data.activityNumber, action),
          options: {
            variant: 'success'
          }
        })
      );
    } catch (err) {
      dispatch(enqueueRequestErrorSnackbar());
    }
  };

  return !isFetching ? (
    <Form
      onSubmit={handleOperations}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <GridContainer>
            <Grid item xs={12} md={9}>
              <Field
                id="text"
                variant="filled"
                fullWidth
                name="reasonForAction"
                rows={3}
                label={t('oshaViolations.manualOps.reasonForAction', 'Reason For Action*')}
                multiline
                component={TextField}
              />
            </Grid>
            <Grid container item direction="row" alignItems="center" spacing={2}>
              {operationOptions[status].map((operation: string, index: any) => (
                <Grid item key={index}>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    value={operation}
                    onClick={e => {
                      setOpenDialog(true);
                      setCurrentAction(e.currentTarget.value);
                    }}
                    disabled={
                      [operations.unassociate, operations.moveToPending].includes(operation)
                        ? !values.reasonForAction?.length
                        : !(values.reasonForAction && selected)
                    }
                  >
                    {getOperationLabel(operation)}
                  </Button>
                </Grid>
              ))}
              <Grid item>
                <Button type="reset" size="small" className={classes.button} onClick={handleClearClick}>
                  {t('oshaViolations.common.cancel', 'Cancel')}
                </Button>
              </Grid>
            </Grid>
            {openDialog && (
              <Dialog open={openDialog}>
                <DialogTitle>{getDialogTitle(currentAction)}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {currentAction && operationConfirmation(currentAction, status, t)}
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="primary"
                    onClick={() => {
                      setOpenDialog(false);
                      setCurrentAction('');
                    }}
                  >
                    {t('oshaViolations.common.cancel', 'Cancel')}
                  </Button>
                  <LoadingButton
                    onClick={() => handleOperations(values)}
                    variant="contained"
                    color="primary"
                    disabled={false}
                  >
                    {isFetchingUpdatedViolation ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t('oshaViolations.manualOps.ok', 'Ok')
                    )}
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            )}
          </GridContainer>
        </form>
      )}
    />
  ) : null;
};
