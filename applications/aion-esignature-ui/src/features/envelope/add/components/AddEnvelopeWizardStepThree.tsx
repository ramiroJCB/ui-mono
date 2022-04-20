import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AutocompleteContractorsContainer } from 'features/contractors/containers/AutocompleteContractors';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { useTranslation } from 'react-i18next';

export const AddEnvelopeWizardStepThree: React.FC = () => {
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Typography>
          {t('eSignature.envelope.add.whoWillSignDocument', 'Select who will sign this document.')}
        </Typography>
      </Grid>
      <Grid item lg={4} md={8} xs={10}>
        <AutocompleteContractorsContainer includeAllContractorsOption />
      </Grid>
    </GridContainer>
  );
};
