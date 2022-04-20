import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAddSafetyProgram } from 'interfaces/safetyProgram';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { SafetyProgramForm } from './SafetyProgramForm';
import { useTranslation } from 'react-i18next';

type Props = {
  onSubmit: (values: IAddSafetyProgram, form: FormApi<IAddSafetyProgram>) => Promise<void>;
};

export const AddSafetyProgramComponent: React.FC<Props> = ({ onSubmit }) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Breadcrumbs
          links={[
            {
              to: '/safety-programs',
              children: t('safetyPrograms.common.programEditor', 'Program Editor')
            },
            {
              to: '/safety-programs/add',
              children: t('safetyPrograms.common.addProgram', 'Add Program')
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper>
          <SafetyProgramForm
            cancelTo="/safety-programs"
            onSubmit={onSubmit}
            title={t('safetyPrograms.common.addProgram', 'Add Program')}
            submitButtonText={t('safetyPrograms.common.next', 'Next')}
          />
        </Paper>
      </Grid>
    </GridContainer>
  );
};
