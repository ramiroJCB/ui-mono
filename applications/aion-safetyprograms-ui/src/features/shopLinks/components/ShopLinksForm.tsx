import * as React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import { arrayMapIsEqual } from 'helpers/form';
import { Field, Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IEditShopLinksForm, ISafetyProgram } from 'interfaces/safetyProgram';
import { Link } from 'react-router-dom';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { Prompt } from '@pec/aion-ui-components/components/Prompt';
import { DeepReadonly } from 'utility-types';
import { EditShopLinksComponent } from './EditShopLinks';
import { useTranslation } from 'react-i18next';

type Props = {
  handleHeaderClick: (orderby: string) => () => void;
  orderby: string;
  initialValues: IEditShopLinksForm;
  safetyPrograms: DeepReadonly<ISafetyProgram[]>;
  onConfirm?: () => Promise<void>;
  onSubmit: (values: IEditShopLinksForm, form: FormApi<IEditShopLinksForm>) => Promise<void>;
  submitButtonText: string;
};

export const ShopLinksForm: React.FC<Props> = ({
  handleHeaderClick,
  initialValues,
  onSubmit,
  submitButtonText,
  safetyPrograms,
  orderby
}) => {
  const { t } = useTranslation();

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues}>
      {({ handleSubmit, submitting, invalid, pristine }) => {
        return (
          <form onSubmit={handleSubmit} noValidate>
            <Prompt
              when={submitting === false && !pristine}
              message={t(
                'safetyPrograms.common.leaveConfirmation',
                'Are you sure you want to leave? Unsaved changes will be lost.'
              )}
            />
            <Field name="safetyProgramIds" component="input" type="hidden" isEqual={arrayMapIsEqual} />
            <EditShopLinksComponent
              handleHeaderClick={handleHeaderClick}
              orderby={orderby}
              safetyPrograms={safetyPrograms}
            />
            <GridContainer justify="space-between" spacing={2}>
              <Grid item style={{ padding: 0 }}>
                <GridContainer>
                  <Grid item>
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      isSubmitting={submitting}
                      disabled={pristine || invalid || submitting}
                    >
                      {submitting ? <CircularProgress size={24} color="inherit" /> : submitButtonText}
                    </LoadingButton>
                  </Grid>
                  <Grid item>
                    <Button color="primary" component={Link} to={'/safety-programs'}>
                      {t('safetyPrograms.common.cancel', 'Cancel')}
                    </Button>
                  </Grid>
                </GridContainer>
              </Grid>
            </GridContainer>
          </form>
        );
      }}
    </Form>
  );
};
