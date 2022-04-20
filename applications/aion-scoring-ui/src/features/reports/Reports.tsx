import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ScoringContainer } from 'common/ScoringContainer';

export const Reports: React.FC = () => (
  <ScoringContainer>
    <GridContainer justify="center" alignItems="center">
      <Grid item>
        <Box p={20}>
          <Typography variant="h5" align="center">
            Reports
          </Typography>
        </Box>
      </Grid>
    </GridContainer>
  </ScoringContainer>
);
