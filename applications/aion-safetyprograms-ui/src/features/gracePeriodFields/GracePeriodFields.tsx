import * as React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import get from 'lodash/get';
import Grid from '@material-ui/core/Grid';
import { CheckboxField } from '@pec/aion-ui-form/components/CheckboxField';
import { DateField } from '@pec/aion-ui-form/components/DateField';
import { dateIsOnOrAfter } from '@pec/aion-ui-core/validators';
import { Field } from 'react-final-form';
import { Moment } from 'moment';
import { useForm } from 'react-final-form';
import { useTranslation } from 'react-i18next';

const GRACE_PERIOD_EXP_DATE = 'gracePeriodExpirationDateUtc';
export const GRACE_PERIOD_NEEDED = 'gracePeriodNeeded';

type Props = {
  checkboxLabel?: string;
  hideCheckbox?: boolean;
  disabled?: boolean;
};

export const GracePeriodFields: React.FC<Props> = ({ checkboxLabel, hideCheckbox, disabled }) => {
  const form = useForm();
  const today = new Date();
  const tomorrow = new Date(today.setDate(today.getDate() + 1)).toISOString();
  const gracePeriodNeeded = get(form.getState().values, GRACE_PERIOD_NEEDED || false) as boolean;
  const { t } = useTranslation();

  const handleChangeGracePeriodNeeded = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.checked) {
      form.resetFieldState(GRACE_PERIOD_EXP_DATE);
      form.change(GRACE_PERIOD_EXP_DATE, null);
    }
  };

  return (
    <Grid item xs={12}>
      {!hideCheckbox && (
        <FormControlLabel
          control={
            <Field<boolean>
              type="checkbox"
              name={GRACE_PERIOD_NEEDED}
              component={CheckboxField}
              customOnChange={handleChangeGracePeriodNeeded}
            />
          }
          label={checkboxLabel}
          disabled={disabled}
        />
      )}
      <Box ml={4}>
        <Field<string>
          name={GRACE_PERIOD_EXP_DATE}
          label={t('safetyPrograms.gracePeriodFields.gracePeriodEndDate', 'Grace Period End Date')}
          inputVariant="filled"
          component={DateField}
          width={200}
          required={gracePeriodNeeded}
          customOnChange={(value: Moment | null) => {
            value &&
              value
                .utc()
                .set({ hour: 23, minute: 59, second: 59 })
                .toISOString();
            form.change(GRACE_PERIOD_EXP_DATE, value);
            form.blur(GRACE_PERIOD_EXP_DATE);
          }}
          disabled={!gracePeriodNeeded || disabled}
          key={gracePeriodNeeded ? 1 : 0}
          validate={gracePeriodNeeded ? dateIsOnOrAfter(tomorrow) : undefined}
        />
      </Box>
    </Grid>
  );
};
