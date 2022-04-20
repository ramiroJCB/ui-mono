import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { connect } from 'react-redux';
import { fetchContractors } from '../actions';
import { Field, FormSpy } from 'react-final-form';
import { IAddTaskGroupForm } from 'interfaces/taskGroupForm';
import { IContractor } from 'interfaces/contractor';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  includeAllContractorsOption?: boolean;
};

const mapStateToProps = (state: RootState) => state.contractors;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { includeAllContractorsOption }: OwnProps
) => ({
  fetchContractors: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchContractors(inputValue, includeAllContractorsOption, page, top))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class AutocompleteContractors extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: OptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<OptionType, SelectAdditional>> =>
    inputValue
      ? await this.props.fetchContractors(page, 100, inputValue)
      : await this.props.fetchContractors(page, 100);

  render() {
    const validate = (_values: IContractor[], allValues: IAddTaskGroupForm) =>
      allValues.tags && allValues.contractors && allValues.tags.length === 0 && allValues.contractors.length === 0
        ? 'or tags in the previous step are required'
        : undefined;

    return (
      <FormSpy<IAddTaskGroupForm>>
        {({ form }) => (
          <Field name="contractors" label="Contractors" validate={validate}>
            {props => (
              <AsyncSelectField<OptionType>
                loadOptions={this.loadOptions}
                closeMenuOnSelect={false}
                placeholder="Select Contractors"
                getOptionLabel={({ name }) => name}
                getOptionValue={({ id }) => id}
                isOptionDisabled={({ id }: IContractor) => form.getState().values.ignoredAssigneeGroups.includes(id)}
                {...props}
              />
            )}
          </Field>
        )}
      </FormSpy>
    );
  }
}

export const AutocompleteContractorsContainer = connect(mapStateToProps, mapDispatchToProps)(AutocompleteContractors);
