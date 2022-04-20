import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { Field } from 'react-final-form';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { useTranslation } from 'react-i18next';

type Props = {
  label?: string;
  loadOptions: (
    inputValue: string,
    prevOptions: OptionType[],
    additional: SelectAdditional
  ) => Promise<AsyncResult<OptionType, SelectAdditional>>;
};

export const AutocompleteWorkGroupsField: React.FC<Props> = ({ loadOptions, label }) => {
  const { t } = useTranslation();

  return (
    <Field name="workGroups">
      {props => (
        <AsyncSelectField<OptionType>
          label={label}
          loadOptions={loadOptions}
          closeMenuOnSelect={false}
          placeholder={t('trainingCompliance.operator.autocompleteWorkGroups.selectWorkGroups', 'Select Work Groups')}
          getOptionLabel={({ name }) => name}
          getOptionValue={({ id }) => id}
          {...props}
        />
      )}
    </Field>
  );
};
