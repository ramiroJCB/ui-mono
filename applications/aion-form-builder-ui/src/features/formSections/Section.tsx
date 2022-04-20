import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import { Button, Paper, Typography, useTheme } from '@material-ui/core';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchForms, formsSelectors } from '../forms/slice';
import { fetchSections, sectionsSelectors } from './slice';
import { FormElements } from '../formElements/FormElements';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { SectionDetails } from './SectionDetails';
import { SectionsList } from './SectionsList';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

export const Section: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { organizationId, formId, sectionId } = useParams<{
    organizationId: string;
    formId: string;
    sectionId: string;
  }>();

  useEffect(() => {
    dispatch(fetchForms({ organizationId }));
    dispatch(fetchSections(formId));
  }, [dispatch, formId, organizationId]);

  const form = useTypedSelector(state => formsSelectors.selectById(state, formId));
  const sections = useTypedSelector(state => sectionsSelectors.selectAll(state));
  const { isFetching: isFetchingForms, error: formsError } = useTypedSelector(state => state.forms);
  const { isFetching: isFetchingSections, error: sectionsError } = useTypedSelector(state => state.sections);
  const currentSection = useTypedSelector(state => sectionsSelectors.selectById(state, sectionId));

  const isFetching = isFetchingForms || isFetchingSections;
  const error = formsError || sectionsError;

  return !isFetching && !error ? (
    <GridContainer>
      <Grid item xs={12}>
        <Paper>
          <GridContainer justify="space-between" spacing={6}>
            <Grid item>
              <Typography variant="h6">{form?.name ?? 'Form Details'}</Typography>
            </Grid>
            <Grid item>
              <Button color="primary">Save</Button>
              <Button variant="contained" color="secondary" type="submit">
                Publish
              </Button>
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper variant="outlined">
          <GridContainer spacing={4}>
            <Grid item xs={12} sm={4} lg={2} style={{ padding: 0, borderRight: `1px solid ${theme.palette.divider}` }}>
              <SectionsList sections={sections} organizationId={organizationId} formId={formId} />
            </Grid>
            <Grid item xs={12} sm={8} lg={10}>
              <GridContainer spacing={2} direction="column">
                <Grid item>
                  {sections.map(section => (
                    <SectionDetails key={section.id} currentSection={currentSection} section={section} />
                  ))}
                </Grid>
                <Grid item style={{ borderTop: `1px solid ${theme.palette.divider}`, marginTop: theme.spacing(4) }}>
                  {currentSection && <FormElements />}
                </Grid>
              </GridContainer>
            </Grid>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  ) : error ? (
    <Error />
  ) : (
    <Loading />
  );
};
