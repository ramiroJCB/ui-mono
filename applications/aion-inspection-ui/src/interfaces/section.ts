import { ComponentType, ConditionDefinition, Validator } from '@data-driven-forms/react-form-renderer';

export type Question = IBaseField | ISelectField | ISubFormField;

export type ConditionalRequired = {
  fieldName: string;
  fieldValue: string[];
};

export interface ISection {
  id: string;
  formId: string;
  organizationId: string;
  description: string;
  name: string;
  sortOrder: number;
  schema: Question[];
}

interface ISchema {
  id: string;
  component: ComponentType;
  name: string;
  title: string;
  description?: string;
}

interface IBaseField extends ISchema {
  label: string;
  type?: 'number';
  isRequired?: boolean;
  conditionalrequired?: ConditionalRequired;
  validate?: Validator[];
}

interface ISelectField extends IBaseField, ISchema {
  options: { value: string; label: string }[];
  isMulti: boolean;
}

interface IConditional {
  condition?: ConditionDefinition | ConditionDefinition[];
}

interface ISubFormField extends ISchema {
  fields: ((Omit<IBaseField, 'title'> | ISelectField) & IConditional)[];
}
