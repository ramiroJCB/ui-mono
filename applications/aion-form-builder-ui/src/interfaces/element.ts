import { IAttachment } from './form';
import { Overwrite } from 'utility-types';

export enum ComponentType {
  TextField = 'TextField',
  TextArea = 'TextArea',
  DatePicker = 'DatePicker',
  TimePicker = 'TimePicker',
  Select = 'Select',
  Checkbox = 'Checkbox',
  Radio = 'Radio',
  FileUpload = 'FileUpload'
}

export interface IElementOption {
  id: string;
  label: string;
  elementId: string;
}

export interface IElementSchema {
  type: string;
  placeHolder: string;
}
export interface IElement {
  id: string;
  sortOrder: number;
  formId: string;
  sectionId: string;
  title: string;
  description: string | null;
  isRequired: boolean;
  options: IElementOption[] | null;
  component: ComponentType;
  schema: IElementSchema | string;
  embeddedMediaMetadata: IAttachment[];
}

type DefaultOptionType = Omit<IElementOption, 'id' | 'elementId'>;

type NewElementProps = {
  options: DefaultOptionType[] | null;
  description: null;
};

export type DefaultElementProps = Overwrite<Omit<IElement, 'id' | 'sortOrder'>, NewElementProps>;

export const ComponentTypeDescription = new Map<ComponentType, string>([
  [ComponentType.TextField, 'Short Answer'],
  [ComponentType.TextArea, 'Long Answer'],
  [ComponentType.DatePicker, 'Date'],
  [ComponentType.TimePicker, 'Time'],
  [ComponentType.Select, 'Dropdown'],
  [ComponentType.Checkbox, 'Checkboxes'],
  [ComponentType.Radio, 'Multiple Choice'],
  [ComponentType.FileUpload, 'File Upload']
]);
