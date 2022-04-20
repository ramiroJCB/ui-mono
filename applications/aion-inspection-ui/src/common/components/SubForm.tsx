import React from 'react';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';
import { Field } from '@data-driven-forms/react-form-renderer';
import { SubFormProps } from '@data-driven-forms/mui-component-mapper/dist/cjs/sub-form';

export const SubForm: React.FC<SubFormProps> = ({ fields }) => {
  const { renderForm } = useFormApi();
  return <React.Fragment>{renderForm(fields as Field[])}</React.Fragment>;
};
