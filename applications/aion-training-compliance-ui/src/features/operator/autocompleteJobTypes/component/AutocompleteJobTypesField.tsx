import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { Field } from 'react-final-form';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { useTranslation } from 'react-i18next';

type Props = {
  label?: string;
  className?: string;
  validate?: (values: IJobType[]) => Promise<JSX.Element | string | undefined>;
  loadOptions: (
    inputValue: string,
    prevOptions: OptionType[],
    additional: SelectAdditional
  ) => Promise<AsyncResult<OptionType, SelectAdditional>>;
};

export const AutocompleteJobTypesField: React.FC<Props> = ({ loadOptions, validate, label, className }) => {
  const { t } = useTranslation();

  return (
    <Field name="jobTypes" validate={validate}>
      {props => (
        <AsyncSelectField<OptionType>
          label={label}
          loadOptions={loadOptions}
          closeMenuOnSelect={false}
          placeholder={t('trainingCompliance.operator.autocompleteJobTypes.selectJobTypes', 'Select Job Types')}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ id }) => id}
          className={className}
          {...props}
        />
      )}
    </Field>
  );
};
