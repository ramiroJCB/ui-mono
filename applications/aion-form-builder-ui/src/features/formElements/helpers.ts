import { ComponentType, DefaultElementProps } from 'interfaces/element';

const { TextField, TextArea, DatePicker, TimePicker, Select, Checkbox, Radio, FileUpload } = ComponentType;

type DefaultElement = Omit<DefaultElementProps, 'formId' | 'sectionId' | 'title' | 'component'>;

const defaultSchema = JSON.stringify({
  type: 'text',
  placeHolder: 'Enter some text'
});

const defaultElement: DefaultElement = {
  description: null,
  isRequired: true,
  options: null,
  schema: defaultSchema,
  embeddedMediaMetadata: []
};

export const getDefaultElement = (componentType: ComponentType): DefaultElement =>
  ({
    [TextField]: defaultElement,
    [TextArea]: defaultElement,
    [DatePicker]: defaultElement,
    [TimePicker]: defaultElement,
    [Select]: defaultElement,
    [Checkbox]: { ...defaultElement, options: getDefaultOptions(1) },
    [Radio]: { ...defaultElement, options: getDefaultOptions(2) },
    [FileUpload]: defaultElement
  }[componentType]);

const getDefaultOptions = (count: number) =>
  Array.apply(null, Array(count)).map((_x, i) => ({ label: `Option ${i + 1}` }));
