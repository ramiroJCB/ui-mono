import * as React from 'react';
import { Field, FieldProps } from 'react-final-form';
import { FieldState } from 'final-form';

type OwnProps = {
  debounceTimer?: number;
};

type Props<T> = FieldProps<T, HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> & OwnProps;

export class DebouncingValidatingField<T> extends React.Component<Props<T>> {
  clearTimeout?: () => void;

  validate = (value: T, allValues: object, meta: FieldState<T>) => {
    const { debounceTimer, validate } = this.props;

    if (meta.active) {
      return new Promise(resolve => {
        if (this.clearTimeout) this.clearTimeout();

        const timerId = setTimeout(() => resolve(validate && validate(value, allValues, meta)), debounceTimer || 500);

        this.clearTimeout = () => {
          clearTimeout(timerId);
          resolve();
        };
      });
    } else {
      return validate && validate(value, allValues, meta);
    }
  };

  render() {
    return <Field<T> {...this.props} validate={this.validate} />;
  }
}
