import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { addForm } from './slice';
import { addSection } from '../formSections/slice';
import { Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { EditorField } from '@pec/aion-ui-text-editor/components/EditorField';
import { Field, Form } from 'react-final-form';
import { IAddForm } from 'interfaces/form';
import { Link } from 'react-router-dom';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch } from 'app/reducer';
import { useHistory, useParams } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(4)
    },
    cancel: {
      marginLeft: theme.spacing(1)
    }
  })
);

export const AddForm: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { organizationId } = useParams<{ organizationId: string }>();
  const history = useHistory();

  const handleSubmit = (values: IAddForm) =>
    new Promise<void>(async (resolve, reject) => {
      try {
        const form = await dispatch(addForm({ ...values, organizationId }));
        const { id: formId } = unwrapResult(form);

        const section = {
          name: 'Section 1',
          formId: formId,
          description: null,
          embeddedMediaMetadata: []
        };

        const result = await dispatch(addSection(section));
        const { id: sectionId } = unwrapResult(result);

        history.push(`/${organizationId}/forms/${formId}/sections/${sectionId}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" gutterBottom>
        New Form
      </Typography>
      <Grid container>
        <Grid item xs={12}>
          <Form onSubmit={handleSubmit}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit} noValidate>
                <Grid container spacing={3} direction="column">
                  <Grid item xs={12} md={5} lg={4}>
                    <Field<string>
                      name="name"
                      label="Form Title"
                      component={TextField}
                      variant="filled"
                      fullWidth
                      required
                      validate={required}
                    />
                  </Grid>
                  <Grid item xs={12} md={5} lg={4}>
                    <Field<string> name="code" label="Form Code" component={TextField} variant="filled" fullWidth />
                  </Grid>
                  <Grid item xs={12} md={10} lg={8}>
                    <Field<string> name="description" label="Form Description (optional)" component={EditorField} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" color="primary" type="submit">
                      Next
                    </Button>
                    <Button color="primary" component={Link} to={`/${organizationId}/forms`} className={classes.cancel}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Form>
        </Grid>
      </Grid>
    </Paper>
  );
};
