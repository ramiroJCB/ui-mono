import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AutocompleteJobTypesField } from '../component/AutocompleteJobTypesField';
import { connect } from 'react-redux';
import { fetchAutocompleteJobTypes } from '../actions/fetchAutocompleteJobTypes';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  validate?: (values: IJobType[]) => Promise<JSX.Element | string | undefined>;
  label?: string;
  className?: string;
};

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (state: RootState) => state.autocompleteJobTypes;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchJobTypes: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchAutocompleteJobTypes(organizationId, inputValue, page, top))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class AutocompleteJobTypes extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: OptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<OptionType, SelectAdditional>> =>
    inputValue ? await this.props.fetchJobTypes(page, 100, inputValue) : await this.props.fetchJobTypes(page, 100);

  render() {
    const { validate, label, className } = this.props;

    return (
      <AutocompleteJobTypesField
        loadOptions={this.loadOptions}
        validate={validate}
        label={label}
        className={className}
      />
    );
  }
}

export const AutocompleteJobTypesContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutocompleteJobTypes)
);
