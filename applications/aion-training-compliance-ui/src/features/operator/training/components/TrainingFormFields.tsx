import * as React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { CheckboxField } from '@pec/aion-ui-form/components/CheckboxField';
import { ExpirationUnits } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { Field } from 'react-final-form';
import { FormApi } from 'final-form';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { IAddTrainingForm } from 'interfaces/addTrainingForm';
import { SelectField } from '@pec/aion-ui-form/components/SelectField';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { getTrainingExpirationDuration, getTrainingExpirationInMilliseconds } from 'helpers/trainingExpiration';
import { required } from '@pec/aion-ui-core/validators';
import { withTranslation } from 'react-i18next';

const styles = () =>
  createStyles({
    field: {
      '& input': {
        textAlign: 'right'
      }
    },
    selectField: {
      margin: '16px'
    }
  });

type OwnProps = {
  form: FormApi<IAddTrainingForm>;
  expirationUnits: ExpirationUnits | null;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

class TrainingFormFieldsComponent extends React.Component<Props> {
  validateExpiration = (_value: number | string, { expirationMillis, expirationUnits }: IAddTrainingForm) =>
    (expirationMillis && expirationUnits !== null) || !expirationUnits
      ? undefined
      : this.props.t('trainingCompliance.common.isRequired', 'is required');

  formatExpiration = (expirationUnits: ExpirationUnits | null) => (expirationMillis: number) =>
    expirationUnits && expirationMillis && getTrainingExpirationDuration(expirationMillis, expirationUnits);

  parseExpiration = (expirationUnits: ExpirationUnits | null) => (expirationMillis: string) =>
    expirationUnits && expirationMillis ? getTrainingExpirationInMilliseconds(expirationMillis, expirationUnits) : 0;

  formatExpirationUnits = (value: any) => (value ? value : ExpirationUnits.None);
  parseExpirationUnits = (value: any) => (value !== ExpirationUnits.None ? value : null);

  customOnChange = (form: FormApi<IAddTrainingForm>) => () => {
    const { expirationUnits, expirationMillis } = form.getState().values;

    if (expirationUnits) {
      const expirationAmount = expirationMillis ? getTrainingExpirationDuration(expirationMillis, expirationUnits) : 0;
      form.change('expirationMillis', getTrainingExpirationInMilliseconds(expirationAmount, expirationUnits));
    } else {
      form.change('expirationMillis', null);
      form.change('expirationUnits', null);
    }
  };

  render() {
    const { None, Years, Months, Weeks, Days } = ExpirationUnits;
    const { classes, form, expirationUnits, t } = this.props;

    return (
      <React.Fragment>
        <Grid item xs={12}>
          <Field<string>
            name="name"
            label={t('trainingCompliance.common.title', 'Title')}
            component={TextField}
            fullWidth
            required
            validate={required}
          />
        </Grid>
        <Grid item xs={12}>
          <Field<string>
            name="description"
            label={t('trainingCompliance.operator.training.descriptionAndInstructions', 'Description and Instructions')}
            component={TextField}
            fullWidth
            required
            multiline
            rows="12"
            variant="outlined"
            validate={required}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={8} md={3}>
              <Field<number>
                name="expirationMillis"
                label={t('trainingCompliance.operator.training.expirationPeriod', 'Expiration Period')}
                type="number"
                component={TextField}
                format={this.formatExpiration(expirationUnits)}
                parse={this.parseExpiration(expirationUnits)}
                fullWidth
                required={expirationUnits !== null}
                disabled={!expirationUnits}
                validate={this.validateExpiration}
                className={classes.field}
              />
            </Grid>
            <Grid item xs={4}>
              <Field<string>
                name="expirationUnits"
                component={SelectField}
                className={classes.selectField}
                validate={this.validateExpiration}
                format={this.formatExpirationUnits}
                parse={this.parseExpirationUnits}
                customOnChange={this.customOnChange(form)}
              >
                <MenuItem value={None}>{t('trainingCompliance.common.noExpiration', 'No expiration')}</MenuItem>
                <MenuItem value={Years}>{t('trainingCompliance.operator.training.year', 'Year(s)')}</MenuItem>
                <MenuItem value={Months}>{t('trainingCompliance.operator.training.month', 'Month(s)')}</MenuItem>
                <MenuItem value={Weeks}>{t('trainingCompliance.operator.training.week', 'Week(s)')}</MenuItem>
                <MenuItem value={Days}>{t('trainingCompliance.operator.training.day', 'Day(s)')}</MenuItem>
              </Field>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            label={t('trainingCompliance.operator.training.recordRequired', 'Record of training upload required?')}
            control={<Field<boolean> type="checkbox" name="uploadRequired" component={CheckboxField} />}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

export const TrainingFormFields = withStyles(styles)(withTranslation()(TrainingFormFieldsComponent));
