import * as React from 'react';
import Downshift, { ControllerStateAndHelpers } from 'downshift';
import { AutocompleteSuggestionsFloating } from '@pec/aion-ui-deprecated/components/Autocomplete/SuggestionsFloating';
import { AxiosError } from 'axios';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { Field, GenericField } from 'redux-form';
import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';
import { DeepReadonly } from 'utility-types';
import { required } from '@pec/aion-ui-core/validators';
import { StandardTextFieldProps } from '@material-ui/core/TextField';
import { TextField } from '@pec/aion-ui-deprecated/components/TextField';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type OwnProps = {
  options: DeepReadonly<IAutocompleteOption[]>;
  filter?: (options: DeepReadonly<IAutocompleteOption[]>, inputValue: string) => DeepReadonly<IAutocompleteOption[]>;
  handleChange: (item: IAutocompleteOption) => void;
  handleKeyUp?: (stateAndHelpers: ControllerStateAndHelpers<IAutocompleteOption>) => void;
  isFetching?: boolean;
  error?: AxiosError | null;
  total?: number | null;
};

const styles = () =>
  createStyles({
    container: {
      flexGrow: 1
    }
  });

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

class AutoCompleteOrganizations extends React.Component<Props> {
  formatItem = (value: string | IAutocompleteOption) => (value ? (typeof value === 'string' ? value : value.name) : '');

  handleBlur = ({
    clearSelection,
    inputValue,
    selectItem,
    selectedItem
  }: ControllerStateAndHelpers<IAutocompleteOption>) => (_event: React.FocusEvent<HTMLInputElement>) => {
    if (inputValue) {
      if (!selectedItem || selectedItem.name !== inputValue) {
        const item = {
          id: '00000000-0000-0000-0000-000000000000',
          name: inputValue
        };
        this.props.handleChange(item);
        selectItem(item);
      }
    } else {
      clearSelection();
    }
  };

  handleClick = (stateAndHelpers: ControllerStateAndHelpers<IAutocompleteOption>) => () => {
    stateAndHelpers.openMenu();
  };

  handleKeyUp = (stateAndHelpers: ControllerStateAndHelpers<IAutocompleteOption>) => (
    _event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const { handleKeyUp } = this.props;
    if (handleKeyUp) {
      handleKeyUp(stateAndHelpers);
    }
  };

  itemToString = (item: IAutocompleteOption) => (item ? item.name : '');

  render() {
    const { options, classes, filter, isFetching, error, total, t } = this.props;
    const FieldCustom = Field as new () => GenericField<StandardTextFieldProps>;
    return (
      <Downshift itemToString={this.itemToString} onChange={this.props.handleChange}>
        {stateAndHelpers => (
          <div className={classes.container}>
            <FieldCustom
              variant="filled"
              name="organization"
              component={TextField}
              fullWidth
              {...stateAndHelpers.getInputProps({
                type: 'search',
                onBlur: this.handleBlur(stateAndHelpers),
                onKeyUp: this.handleKeyUp(stateAndHelpers),
                onClick: this.handleClick(stateAndHelpers)
              })}
              required
              validate={required}
              label={t('smart.autoComplete.employerName', 'Employer Name')}
              format={this.formatItem}
            />
            <AutocompleteSuggestionsFloating
              options={options}
              filter={filter}
              isFetching={isFetching}
              error={error}
              total={total}
              {...stateAndHelpers}
            />
          </div>
        )}
      </Downshift>
    );
  }
}

export const AutoCompleteOrganizationsComponent = withStyles(styles)(withTranslation()(AutoCompleteOrganizations));
