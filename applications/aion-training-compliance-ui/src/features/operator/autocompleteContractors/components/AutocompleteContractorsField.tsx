import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { Field } from 'react-final-form';
import { IContractor } from 'interfaces/contractor';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { useTranslation } from 'react-i18next';

type Props = {
  label?: string;
  className?: string;
  validate?: (values: IContractor[]) => Promise<JSX.Element | string | undefined>;
  loadOptions: (
    inputValue: string,
    prevOptions: OptionType[],
    additional: SelectAdditional
  ) => Promise<AsyncResult<OptionType, SelectAdditional>>;
};

export const AutocompleteContractorsField: React.FC<Props> = ({ loadOptions, validate, label, className }) => {
  const { t } = useTranslation();

  return (
    <Field name="contractors" validate={validate}>
      {props => (
        <AsyncSelectField<OptionType>
          label={label}
          loadOptions={loadOptions}
          closeMenuOnSelect={false}
          placeholder={t('trainingCompliance.operator.autocompleteContractors.selectContractors', 'Select Contractors')}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ id }) => id}
          className={className}
          {...props}
        />
      )}
    </Field>
  );
};
