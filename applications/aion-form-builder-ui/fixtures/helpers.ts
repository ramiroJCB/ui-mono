import * as faker from 'faker';
import { ComponentType, IElementSchema } from '../src/interfaces/element';

const { TextField } = ComponentType;

export const randomComponentType = () => faker.random.arrayElement([TextField]);

const elementSchemaTypes = ['text'];

export const randomElementSchema = () => {
  const schema = { type: faker.random.arrayElement(elementSchemaTypes), placeHolder: 'Enter answer' } as IElementSchema;
  return JSON.stringify(schema);
};
