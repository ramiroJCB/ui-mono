import * as React from 'react';
import { createFilter } from 'react-select';
import { FieldRenderProps } from 'react-final-form';
import { SelectField } from '@pec/aion-ui-form/components/Autocomplete/SelectField';
import { USAStates } from '@pec/aion-ui-core/constants/USAStates';
import { useTranslation } from 'react-i18next';

const customFilter = createFilter({
  matchFrom: 'start'
});

type Props = FieldRenderProps<any, HTMLElement>;

export const SelectState: React.FC<Props> = props => {
  const { t } = useTranslation();

  return (
    <SelectField
      id="state"
      label={t('classes.classesList.state', 'State')}
      menuPosition="fixed"
      maxMenuHeight={200}
      isClearable
      options={USAStates}
      required
      filterOption={customFilter}
      {...props}
    />
  );
};
