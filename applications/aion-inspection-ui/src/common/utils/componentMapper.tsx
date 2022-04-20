import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import DatePicker, { DatePickerProps } from '@data-driven-forms/mui-component-mapper/dist/cjs/date-picker';
import RadioField, { RadioProps } from '@data-driven-forms/mui-component-mapper/dist/cjs/radio';
import React from 'react';
import SelectField, { SelectProps } from '@data-driven-forms/mui-component-mapper/dist/cjs/select';
import TextField, { TextFieldProps } from '@data-driven-forms/mui-component-mapper/dist/cjs/text-field';
import TimePicker, { TimePickerProps } from '@data-driven-forms/mui-component-mapper/dist/cjs/time-picker';
import { ComponentMapper, FieldApi, FormOptions } from '@data-driven-forms/react-form-renderer';
import { ConditionalRequired } from 'interfaces/section';
import { FormFieldGrid } from '../components/FormFieldGrid';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { SubForm } from 'common/components/SubForm';
import { SubFormProps } from '@data-driven-forms/mui-component-mapper/dist/cjs/sub-form';

export const componentMapper: ComponentMapper = {
  [componentTypes.TEXT_FIELD]: {
    component: (props: TextFieldProps) => <FormFieldGrid {...props} component={TextField} />,
    clearOnUnmount: true,
    variant: 'filled'
  },
  [componentTypes.TEXTAREA]: {
    component: (props: TextFieldProps) => <FormFieldGrid {...props} component={TextField} />,
    clearOnUnmount: true,
    rows: 6,
    variant: 'filled',
    multiline: true,
    resolveProps: (
      props: TextFieldProps & { conditionalrequired: ConditionalRequired },
      _fieldProps: FieldApi<string>,
      formOptions: FormOptions
    ) => {
      let isRequired = props.isRequired;

      if (props.conditionalrequired) {
        const { fieldName, fieldValue } = props.conditionalrequired;
        isRequired = fieldValue.includes(formOptions.getState().values[fieldName]);
      }

      return { isRequired, conditionalrequired: null };
    }
  },
  [componentTypes.SELECT]: {
    component: (props: SelectProps<Option>) => <FormFieldGrid {...props} component={SelectField} />,
    clearOnUnmount: true,
    TextFieldProps: {
      variant: 'filled',
      margin: 'none'
    }
  },
  [componentTypes.RADIO]: {
    component: (props: RadioProps) => <FormFieldGrid {...props} component={RadioField} />,
    clearOnUnmount: true
  },
  [componentTypes.DATE_PICKER]: {
    component: (props: DatePickerProps) => <FormFieldGrid {...props} component={DatePicker} />,
    clearOnUnmount: true,
    DatePickerProps: {
      inputVariant: 'filled',
      format: 'MM/DD/YYYY',
      margin: 'none'
    }
  },
  [componentTypes.TIME_PICKER]: {
    component: (props: TimePickerProps) => <FormFieldGrid {...props} component={TimePicker} />,
    clearOnUnmount: true,
    inputVariant: 'filled',
    margin: 'none'
  },
  [componentTypes.SUB_FORM]: {
    component: (props: SubFormProps) => <FormFieldGrid {...props} subForm component={SubForm} />
  }
};
