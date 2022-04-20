import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IExpandedMandate } from 'interfaces/mandate';
import { IMandateForm } from 'interfaces/mandate';
import { MandateForm } from './MandateForm';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { useTranslation } from 'react-i18next';

type Props = {
  clientId: string;
  mandateId: string;
  onConfirmDelete: () => Promise<void>;
  onSubmit: (values: IMandateForm, form: FormApi<IMandateForm>) => Promise<void>;
  mandate: DeepReadonly<IExpandedMandate> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
};

export const EditMandateComponent: React.FC<Props> = ({
  clientId,
  mandateId,
  onConfirmDelete,
  onSubmit,
  mandate,
  isFetching,
  error
}) => {
  const title = !isFetching && mandate ? mandate.safetyProgram.title : '⋯';
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
              children: !isFetching && mandate ? mandate.client.name : '⋯'
            },
            {
              to: `/safety-programs/clients/${clientId}/mandates/${mandateId}`,
              children: title
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <GridContainer>
            <Grid item xs={12}>
              <Typography variant="h6">{title}</Typography>
            </Grid>
            <Grid item xs={12}>
              {!isFetching && mandate && (
                <MandateForm
                  clientId={clientId}
                  onConfirmDelete={onConfirmDelete}
                  onSubmit={onSubmit}
                  assignableSafetyPrograms={[mandate.safetyProgram]}
                  initialValues={{
                    id: mandateId,
                    clientId,
                    safetyProgramId: mandate.safetyProgramId,
                    businessUnitIds: mandate.businessUnits.map(({ id }) => id),
                    regionalServiceIdsByRegion: mandate.regionalServices.reduce(
                      (a, { id, serviceRegionId }) => ({
                        ...a,
                        [serviceRegionId]: (a[serviceRegionId] || []).concat([id])
                      }),
                      {}
                    ),
                    assigneesType:
                      mandate.businessUnits.length > 0
                        ? 'businessUnits'
                        : mandate.regionalServices.length > 0
                        ? 'services'
                        : 'allContractors',
                    gracePeriodExpirationDateUtc: mandate.gracePeriodExpirationDateUtc,
                    gracePeriodNeeded: mandate.gracePeriodExpirationDateUtc !== null
                  }}
                  submitButtonText={t('safetyPrograms.common.save', 'Save')}
                />
              )}
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
