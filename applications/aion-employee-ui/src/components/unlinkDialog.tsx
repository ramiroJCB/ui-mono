import * as React from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  withStyles,
  WithStyles,
  Theme
} from '@material-ui/core';
import { DialogTransition } from '@pec/aion-ui-components/components/DialogTransition';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

const styles = (theme: Theme) =>
  createStyles({
    button: {
      marginTop: 16,
      marginLeft: 16
    },
    buttonYes: {
      marginTop: 16,
      marginLeft: 16,
      color: theme.palette.error.main
    }
  });

type OwnProps = {
  isModalOpen: boolean;
  cancelLinking: () => void;
  requestLinking: () => void;
  isFetching: boolean;
};

type Props = OwnProps & WithStyles & I18nextProps;

const UnlinkingDialog = ({ isModalOpen, cancelLinking, classes, requestLinking, isFetching, t }: Props) => (
  <Dialog
    open={isModalOpen}
    maxWidth="xs"
    onEscapeKeyDown={cancelLinking}
    onBackdropClick={cancelLinking}
    TransitionComponent={DialogTransition}
  >
    <DialogTitle>{t('employee.unlinkDialog.unlinkEmployees', 'Unlink Employees')}</DialogTitle>
    <DialogContent>
      {isFetching ? (
        <Loading />
      ) : (
        <React.Fragment>
          <DialogContentText>
            {t(
              'employee.unlinkDialog.theseTwoEmployees',
              'These two employees are not the same person and will be unlinked'
            )}
          </DialogContentText>
          <Grid container justify="flex-end" direction="row" alignItems="flex-end">
            <Grid item>
              <Button onClick={cancelLinking} className={classes.button}>
                {t('employee.common.cancel', 'CANCEL')}
              </Button>
            </Grid>
            <Grid item>
              <Button className={classes.buttonYes} onClick={requestLinking}>
                {t('employee.unlinkDialog.yesUnlink', 'YES, UNLINK')}
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </DialogContent>
  </Dialog>
);

export const UnlinkingDialogComponent = withStyles(styles)(withTranslation()(UnlinkingDialog));
