import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { Field } from 'react-final-form';
import { IEmployee } from 'interfaces/employee';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = () => ({
  autoCompleteField: {
    marginTop: 12
  }
});

type OwnProps = {
  validate?: (values: IEmployee[]) => Promise<JSX.Element | string | undefined>;
  loadOptions: (
    inputValue: string,
    prevOptions: OptionType[],
    additional: SelectAdditional
  ) => Promise<AsyncResult<OptionType, SelectAdditional>>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const AutocompleteEmployeesFieldComponent: React.FC<Props> = ({ classes, loadOptions, validate }) => {
  const { t } = useTranslation();

  return (
    <Field name="employees" validate={validate}>
      {props => (
        <AsyncSelectField<OptionType>
          loadOptions={loadOptions}
          closeMenuOnSelect={false}
          placeholder={t('trainingCompliance.contractor.autocompleteEmployees.selectEmployees', 'Select Employees')}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ id }) => id}
          className={classes.autoCompleteField}
          {...props}
        />
      )}
    </Field>
  );
};

export const AutocompleteEmployeesField = withStyles(styles)(AutocompleteEmployeesFieldComponent);
