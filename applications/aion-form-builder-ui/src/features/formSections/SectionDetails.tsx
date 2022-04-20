import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { EditorField } from '@pec/aion-ui-text-editor/components/EditorField';
import { Field, Form } from 'react-final-form';
import { FormApi } from 'final-form';
import { ISection } from '../../interfaces/section';
import { isEqual } from 'lodash';
import { required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { updateSection } from './slice';
import { useAppDispatch } from 'app/reducer';

type Props = {
  section: ISection;
  currentSection: ISection | undefined;
};

export const SectionDetails: React.FC<Props> = ({ section, currentSection }) => {
  const dispatch = useAppDispatch();

  // TODO: submission handling will be part of upcoming story
  const handleSubmit = (values: ISection) =>
    new Promise<void>(async (resolve, reject) => {
      try {
        console.log(values);

        resolve();
      } catch (error) {
        reject(error);
      }
    });

  const handleFormBlur = (form: FormApi<ISection>) => async (_event: React.FocusEvent<HTMLFormElement>) => {
    const formState = form.getState();
    const isValid = formState.valid;
    const currentValues = formState.values;
    const hasNewValues = !isEqual(formState.initialValues, currentValues);

    if (hasNewValues && isValid) {
      await dispatch(updateSection(currentValues));
    }
  };

  return currentSection && currentSection.id === section.id ? (
    <>
      <Box mb={2}>
        <Typography component="div" variant="overline">
          Section Details
        </Typography>
      </Box>
      <Form initialValues={section} onSubmit={handleSubmit} keepDirtyOnReinitialize>
        {({ handleSubmit, form }) => (
          <form onSubmit={handleSubmit} noValidate onBlur={handleFormBlur(form)}>
            <Grid container spacing={3} direction="column">
              <Grid item xs={12} md={5} lg={4}>
                <Field<string>
                  name="name"
                  label="Section Title"
                  component={TextField}
                  variant="outlined"
                  fullWidth
                  required
                  validate={required}
                />
              </Grid>
              <Grid item xs={12}>
                <Field<string> name="description" label="Description (optional)" component={EditorField} />
              </Grid>
            </Grid>
          </form>
        )}
      </Form>
    </>
  ) : null;
};
