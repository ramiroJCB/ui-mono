import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { connect } from 'react-redux';
import { Field, FormSpy } from 'react-final-form';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';
import { fetchClientsAutocomplete } from 'features/clients/actions/fetchClients';
import { IProgramStatusFormFilters } from 'interfaces/programStatusForm';

const mapStateToProps = (state: RootState) => state.clients;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchClients: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchClientsAutocomplete(page, top, inputValue))
});
type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class AutocompleteClients extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: OptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<OptionType, SelectAdditional>> =>
    inputValue ? await this.props.fetchClients(page, 100, inputValue) : await this.props.fetchClients(page, 100);

  render() {
    return (
      <FormSpy<IProgramStatusFormFilters>>
        {({ form }) => (
          <Field name="clients" required={form.getState().values['isForAllClients'] === false}>
            {props => (
              <AsyncSelectField<OptionType>
                loadOptions={this.loadOptions}
                closeMenuOnSelect={false}
                placeholder="Select Clients"
                getOptionLabel={({ name }) => name}
                getOptionValue={({ id }) => id}
                isDisabled={form.getState().values['isForAllClients'] === true}
                {...props}
              />
            )}
          </Field>
        )}
      </FormSpy>
    );
  }
}

export const AutocompleteClientsContainer = connect(mapStateToProps, mapDispatchToProps)(AutocompleteClients);
