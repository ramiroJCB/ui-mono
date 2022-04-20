import React, { useEffect } from 'react';
import { AddElement } from './AddElement';
import { ElementCard } from './ElementCard';
import { elementsSelectors, fetchElements } from './slice';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Grid, Typography, useTheme } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

export const FormElements: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { sectionId } = useParams<{ sectionId: string }>();

  useEffect(() => {
    dispatch(fetchElements(sectionId));
  }, [dispatch, sectionId]);

  const elements = useTypedSelector(state => elementsSelectors.selectAll(state));
  const { isFetching, error } = useTypedSelector(state => state.elements);

  return !isFetching && !error ? (
    <GridContainer direction="column" spacing={2} style={{ padding: 0 }}>
      <Grid item style={{ marginTop: theme.spacing(2) }}>
        <Typography variant="overline">Form Elements</Typography>
      </Grid>
      {elements.length > 0 &&
        elements.map(element => (
          <Grid key={element.id} item xs={12}>
            <ElementCard element={element} />
          </Grid>
        ))}
      <Grid item>
        <AddElement />
      </Grid>
    </GridContainer>
  ) : error ? (
    <Error />
  ) : (
    <Loading />
  );
};
