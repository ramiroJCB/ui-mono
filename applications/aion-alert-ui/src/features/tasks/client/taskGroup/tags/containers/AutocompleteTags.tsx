import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { connect } from 'react-redux';
import { fetchContractorTags } from '../../contractorTags/actions';
import { fetchTags } from '../actions';
import { Field, FormSpy } from 'react-final-form';
import { FormApi } from 'final-form';
import { IAddTaskGroupForm } from 'interfaces/taskGroupForm';
import { ITag } from 'interfaces/tag';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';

const mapStateToProps = (state: RootState) => {
  const { contractorTags } = state.contractorTags;

  return {
    confirmContractorsByTags:
      contractorTags && contractorTags.every(c => c.tags !== undefined)
        ? contractorTags.map(c => ({ ...c, ignore: true }))
        : []
  };
};

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchTags: (page: number = 1, top: number = 10, inputValue?: string) => dispatch(fetchTags(page, top, inputValue)),
  fetchContractorTags: (tags?: ITag[], page: number = 1, top: number = 10) =>
    dispatch(fetchContractorTags(page, top, tags))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class AutocompleteTags extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: OptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<OptionType, SelectAdditional>> =>
    inputValue ? await this.props.fetchTags(page, 100, inputValue) : await this.props.fetchTags(page, 100);

  handleOnChange = (form: FormApi<IAddTaskGroupForm>) => async () => {
    const { tags, ignoredAssigneeGroups } = form.getState().values;

    if (tags.length) {
      await this.props.fetchContractorTags(tags);
      const confirmContractorsByTags = this.props.confirmContractorsByTags.map(c => ({
        ...c,
        ignore: !ignoredAssigneeGroups.includes(c.id)
      }));
      form.change('confirmContractorsByTags', confirmContractorsByTags);
    } else {
      form.change('ignoredAssigneeGroups', []);
      form.change('confirmContractorsByTags', []);
    }
  };

  render() {
    return (
      <FormSpy<IAddTaskGroupForm>>
        {({ form }) => (
          <Field name="tags" label="Tags">
            {props => (
              <AsyncSelectField<OptionType>
                loadOptions={this.loadOptions}
                closeMenuOnSelect={false}
                placeholder="Select Tags"
                getOptionLabel={({ name }) => name}
                getOptionValue={({ id }) => id}
                customOnChange={this.handleOnChange(form)}
                {...props}
              />
            )}
          </Field>
        )}
      </FormSpy>
    );
  }
}

export const AutocompleteTagsContainer = connect(mapStateToProps, mapDispatchToProps)(AutocompleteTags);
