import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import { AutoCompleteOrganizationsContainer } from 'containers/AutoCompleteOrganization';
import { DeepReadonly } from 'utility-types';
import { DialogTransition } from '@pec/aion-ui-components/components/DialogTransition';
import { Form, InjectedFormProps, reduxForm } from 'redux-form';
import { formatTraineeDisplayName } from 'helpers/formatTraineeDisplayName';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IChangeEmployerForm } from 'interfaces/changeEmployerForm';
import { ITraineeWithEmployees } from '@pec/aion-ui-core/interfaces/trainee';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Trans, useTranslation } from 'react-i18next';

type OwnProps = {
  closeDialog: () => void;
  employerName: string;
  isFetching: boolean;
  shouldDisplay: boolean;
  trainee: DeepReadonly<ITraineeWithEmployees>;
};

type Props = InjectedFormProps<IChangeEmployerForm, OwnProps> & Partial<DialogProps> & OwnProps;

const ChangeEmployerComponent: React.FC<Props> = ({
  closeDialog,
  employerName,
  handleSubmit,
  isFetching,
  shouldDisplay,
  trainee
}) => {
  const { t } = useTranslation();
  const formattedName = formatTraineeDisplayName(trainee.firstName, trainee.lastName);
  return (
    <Form onSubmit={handleSubmit}>
      <Dialog open={shouldDisplay} onClose={closeDialog} TransitionComponent={DialogTransition}>
        <DialogContent>
          <DialogContentText variant="subtitle1">
            <Trans i18nKey="smart.changeEmployer.nameWarning">
              If <strong>{{ employerName }}</strong> is not correct, enter the name of the company that should be
              associated with <strong>{{ formattedName }}</strong>.
            </Trans>
          </DialogContentText>
          <GridContainer style={{ position: 'relative', minHeight: 240 }}>
            <Grid item xs={12}>
              {isFetching ? <Loading /> : <AutoCompleteOrganizationsContainer formName="changeEmployer" />}
            </Grid>
          </GridContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>{t('smart.common.cancel', 'Cancel')}</Button>
          <Button onClick={handleSubmit}>{t('smart.common.continue', 'Continue')}</Button>
        </DialogActions>
      </Dialog>
    </Form>
  );
};

export const ChangeEmployer = reduxForm<IChangeEmployerForm, OwnProps>({
  form: 'changeEmployer',
  enableReinitialize: true
})(ChangeEmployerComponent);
