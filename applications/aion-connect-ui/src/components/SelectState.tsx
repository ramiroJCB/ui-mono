import * as React from 'react';
import { createFilter } from 'react-select';
import { FieldRenderProps } from 'react-final-form';
import { SelectField } from '@pec/aion-ui-form/components/Autocomplete/SelectField';
import { USAStates } from '@pec/aion-ui-core/constants/USAStates';

const customFilter = createFilter({
  matchFrom: 'start'
});

type Props = FieldRenderProps<any, HTMLElement>;

export const SelectState: React.FC<Props> = props => (
  <SelectField
    id="state"
    label="State"
    menuPosition="fixed"
    maxMenuHeight={200}
    isClearable
    options={USAStates}
    required
    filterOption={customFilter}
    {...props}
  />
);
