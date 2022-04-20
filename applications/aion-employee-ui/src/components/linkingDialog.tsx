import * as React from 'react';
import {
  Button,
  createStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  WithStyles
} from '@material-ui/core';
import { DialogTransition } from '@pec/aion-ui-components/components/DialogTransition';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { IVerisourceEmployee } from 'interfaces/VerisourceEmployee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const styles = createStyles({
  button: {
    marginTop: 16,
    marginLeft: 16
  }
});

type OwnProps = {
  isModalOpen: boolean;
  PECEmployee: IPECEmployee;
  verisourceEmployee: IVerisourceEmployee;
  cancelLinking: () => void;
  requestLinking: () => void;
  isFetching: boolean;
};

type Props = OwnProps & WithStyles & I18nextProps;

const LinkingDialog = ({
  isModalOpen,
  PECEmployee,
  verisourceEmployee,
  cancelLinking,
  classes,
  requestLinking,
  isFetching,
  t
}: Props) => (
  <Dialog
    open={isModalOpen}
    fullWidth
    maxWidth="md"
    onEscapeKeyDown={cancelLinking}
    onBackdropClick={cancelLinking}
    TransitionComponent={DialogTransition}
  >
    <DialogTitle>{t('employee.linkingDialog.confirmEmployeeLink', 'Confirm Employee Link')}</DialogTitle>
    <DialogContent>
      {isFetching ? (
        <Loading />
      ) : (
        <React.Fragment>
          <DialogContentText>
            {t(
              'employee.linkingDialog.theseEmployeesWillBeLinked',
              'These Employees will be linked, and the PEC record will appear as the main result in the employee list'
            )}
          </DialogContentText>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('employee.common.firstName', 'First Name')}</TableCell>
                <TableCell>{t('employee.common.lastName', 'Last Name')}</TableCell>
                <TableCell>{t('employee.common.dob', 'DOB')}</TableCell>
                <TableCell>{t('employee.common.id', 'ID')}</TableCell>
                <TableCell>{t('employee.common.source', 'source')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={PECEmployee.id}>
                <TableCell component="th" scope="row">
                  {PECEmployee.traineeFirstName}
                </TableCell>
                <TableCell>{PECEmployee.traineeLastName}</TableCell>
                <TableCell>{localizeDate(PECEmployee.traineeBirthDate, t)}</TableCell>
                <TableCell>{PECEmployee.traineePecIdentifier}</TableCell>
                <TableCell>{t('employee.common.pec', 'PEC')}</TableCell>
              </TableRow>
              <TableRow key={verisourceEmployee.id}>
                <TableCell component="th" scope="row">
                  {verisourceEmployee.firstName}
                </TableCell>
                <TableCell>{verisourceEmployee.lastName}</TableCell>
                <TableCell>{localizeDate(verisourceEmployee.birthDate, t)}</TableCell>
                <TableCell>{verisourceEmployee.id}</TableCell>
                <TableCell>{t('employee.common.veriSource', 'VeriSource')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid container justify="flex-end" direction="row" alignItems="flex-end">
            <Grid item>
              <Button onClick={cancelLinking} className={classes.button}>
                {t('employee.common.cancel', 'CANCEL')}
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained" className={classes.button} onClick={requestLinking}>
                {t('employee.common.link', 'LINK')}
              </Button>
            </Grid>
          </Grid>
        </React.Fragment>
      )}
    </DialogContent>
  </Dialog>
);

export const LinkingDialogComponent = withStyles(styles)(withTranslation()(LinkingDialog));
