import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { Field } from 'react-final-form';
import { IClientAssignedEmployee } from 'interfaces/clientAssignedEmployee';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { useTranslation } from 'react-i18next';

type Props = {
  label?: string;
  loadOptions: (
    inputValue: string,
    prevOptions: IClientAssignedEmployee[],
    additional: SelectAdditional
  ) => Promise<AsyncResult<IClientAssignedEmployee, SelectAdditional>>;
};

export const AutocompleteClientAssignedEmployeesField: React.FC<Props> = ({ loadOptions, label }) => {
  const { t } = useTranslation();

  return (
    <Field name="employees">
      {props => (
        <AsyncSelectField<IClientAssignedEmployee>
          label={label}
          loadOptions={loadOptions}
          closeMenuOnSelect={false}
          placeholder={t(
            'trainingCompliance.operator.autocompleteClientAssignedEmployees.selectEmployees',
            'Select Employees'
          )}
          getOptionLabel={({ employeeName }) => employeeName}
          getOptionValue={({ id }) => id}
          {...props}
        />
      )}
    </Field>
  );
};
