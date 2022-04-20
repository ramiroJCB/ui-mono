import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { ISearchResult } from 'interfaces/searchResult';

type Props = {
  searchResult: DeepReadonly<ISearchResult>;
};

export const InfoWindow: React.FC<Props> = ({ searchResult: { name, city, state, zipCode } }) => (
  <Grid container>
    <Grid item>
      <Typography variant="body2" noWrap>
        {name}
      </Typography>
      <Typography variant="body1" noWrap>
        {city}, {state} {zipCode}
      </Typography>
    </Grid>
  </Grid>
);
