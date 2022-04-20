import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { AutocompleteContractorsContainer } from '../contractors/containers/AutocompleteContractors';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';

export const AddTaskGroupWizardStepThree: React.FC = () => (
  <GridContainer justify="center">
    <Grid item xs={12} md={6}>
      <AutocompleteContractorsContainer includeAllContractorsOption />
    </Grid>
  </GridContainer>
);
