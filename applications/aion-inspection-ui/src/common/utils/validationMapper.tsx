import ddfValidatorMapper from '@data-driven-forms/react-form-renderer/dist/cjs/validator-mapper';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import { ConditionalRequired } from 'interfaces/section';

const conditionalRequired = ({ fieldName, fieldValue }: ConditionalRequired) => (value: string, allValues: Object) => {
  const requiredValidator = ddfValidatorMapper[validatorTypes.REQUIRED]();

  if (fieldValue.includes(allValues[fieldName])) {
    return requiredValidator(value, allValues);
  }

  return undefined;
};

export const validatorMapper = {
  conditionalRequired
};
