import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClient } from 'interfaces/client';
import { IMandateForm } from 'interfaces/mandate';
import { ISafetyProgram } from 'interfaces/safetyProgram';
import { MandateForm } from './MandateForm';
import { NavLink } from 'components/NavLink';
import { Paper } from 'components/Paper';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
  clientId: string;
  onSubmit: (values: IMandateForm, form: FormApi<IMandateForm>) => Promise<void>;
  client: DeepReadonly<IClient> | null;
  assignableSafetyPrograms: DeepReadonly<ISafetyProgram[]> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
};

export const AddMandateComponent: React.FC<Props> = ({
  clientId,
  onSubmit,
  client,
  assignableSafetyPrograms,
  isFetching,
  error
}) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Breadcrumbs
          links={[
            {
              to: '/safety-programs/clients',
              children: t('safetyPrograms.common.assignSafetyPrograms', 'Assign Program Reviews')
            },
            {
              to: `/safety-programs/clients/${clientId}`,
              children: !isFetching && client ? client.name : '⋯'
            },
            {
              to: `/safety-programs/clients/${clientId}/mandates/add`,
              children: t('safetyPrograms.common.assignProgram', 'Assign Program')
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <GridContainer>
            <Grid item xs={12}>
              <Typography variant="h6">{t('safetyPrograms.common.assignProgram', 'Assign Program')}</Typography>
            </Grid>
            <Grid item xs={12}>
              {assignableSafetyPrograms &&
                (assignableSafetyPrograms.length > 0 ? (
                  <MandateForm
                    clientId={clientId}
                    onSubmit={onSubmit}
                    assignableSafetyPrograms={assignableSafetyPrograms}
                    initialValues={{
                      clientId,
                      safetyProgramId: '',
                      businessUnitIds: [],
                      regionalServiceIdsByRegion: {},
                      assigneesType: 'allContractors',
                      gracePeriodExpirationDateUtc: null
                    }}
                    submitButtonText={t('safetyPrograms.common.assignProgram', 'Assign Program')}
                  />
                ) : (
                  <Typography>
                    <Trans i18nKey="safetyPrograms.mandate.availableSafetyProgramsWereAssigned">
                      All available Program Reviews have been assigned.{' '}
                      <NavLink underline="always" to={`/safety-programs/clients/${clientId}`}>
                        Click here to go back.
                      </NavLink>
                    </Trans>
                  </Typography>
                ))}
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
