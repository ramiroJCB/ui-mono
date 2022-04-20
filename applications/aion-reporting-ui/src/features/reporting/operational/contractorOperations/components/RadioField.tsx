import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup, { RadioGroupProps } from '@material-ui/core/RadioGroup';
import { FormControlProps } from '@material-ui/core/FormControl';
import { WrappedFieldProps } from 'redux-form';
import { useTranslation } from 'react-i18next';

export type OwnProps = {
  isLatePost: boolean;
};

export type Props = RadioGroupProps & FormControlProps & WrappedFieldProps & OwnProps;

const RadioField: React.FC<Props> = ({ meta, input, isLatePost, ...props }) => {
  const { t } = useTranslation();

  return (
    <FormControl disabled={isLatePost}>
      <RadioGroup {...input} {...props} row>
        <FormControlLabel
          labelPlacement="start"
          value=""
          control={<Radio checked={input.value === ''} />}
          label={t('reporting.operational.contractorOperations.noSelection', 'No Selection')}
        />
        <FormControlLabel
          labelPlacement="start"
          value="1"
          control={<Radio checked={input.value === '1'} />}
          label={t('reporting.operational.contractorOperations.yes', 'Yes')}
        />
        <FormControlLabel
          labelPlacement="start"
          value="0"
          control={<Radio checked={input.value === '0'} />}
          label={t('reporting.operational.contractorOperations.no', 'No')}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default RadioField;
