import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Field } from 'react-final-form';
import { FieldState } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAnnouncement } from 'interfaces/announcement';
import { IAnnouncementForm } from 'interfaces/announcementForm';
import { maxLength, required } from '@pec/aion-ui-core/validators';
import { TextField } from '@pec/aion-ui-form/components/TextField';

type Props = {
  values: IAnnouncementForm | IAnnouncement;
};

export const CommonAnnouncementFormFields: React.FC<Props> = ({ values: { text } }) => {
  const composeValidators = (...validators: any[]) => (
    value: any,
    allValues: IAnnouncementForm,
    meta: FieldState<any>
  ) => validators.reduce((error, validator) => error || validator(value, allValues, meta), undefined);

  return (
    <GridContainer justify="center">
      <Grid item xs={12}>
        <GridContainer>
          <Grid item xs={12}>
            <Field<string>
              name="text"
              placeholder="Share your latest news..."
              component={TextField}
              multiline
              fullWidth
              rows="12"
              variant="filled"
              required
              validate={composeValidators(maxLength(1000), required)}
              helperText={text ? `${text.length}/1000` : '0/1000'}
            />
          </Grid>
        </GridContainer>
      </Grid>
    </GridContainer>
  );
};
