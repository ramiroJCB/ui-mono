import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'ts-essentials';
import { Field } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITemplate } from 'interfaces/template';
import { MenuItem } from '@material-ui/core';
import { required } from '@pec/aion-ui-core/validators';
import { SelectField } from '@pec/aion-ui-form/components/SelectField';
import { useTranslation } from 'react-i18next';

type Props = {
  templates: DeepReadonly<ITemplate[]>;
};

export const AddEnvelopeWizardStepOne: React.FC<Props> = ({ templates }: Props) => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography>{t('eSignature.envelope.add.theseTemplatesAre', 'These templates are from DocuSign')}</Typography>
      </Grid>
      <Grid item lg={4} md={8} xs={10}>
        <Field<string> name="templateId" component={SelectField} validate={required} required displayEmpty fullWidth>
          <MenuItem value="">{t('eSignature.envelope.add.selectTemplate', 'Select Template')}</MenuItem>
          {templates.map(({ id, name }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Field>
      </Grid>
      {templates.length === 0 && (
        <Grid item xs={10} md={9}>
          <Typography variant="body2" color="error">
            {t(
              'eSignature.envelope.add.noTemplatesAvailable',
              'There are no templates available on your account. To create a template, contact your Veriforce account representative.'
            )}
          </Typography>
        </Grid>
      )}
    </GridContainer>
  );
};
