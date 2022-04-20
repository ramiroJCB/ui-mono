import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AutocompleteContractorsField } from '../components/AutocompleteContractorsField';
import { connect } from 'react-redux';
import { fetchAutocompleteContractors } from '../actions/fetchAutocompleteContractors';
import { fetchAutocompleteNotAssignedContractors } from '../actions/fetchAutocompleteNotAssignedContractors';
import { IContractor } from 'interfaces/contractor';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  validate?: (values: IContractor[]) => Promise<JSX.Element | string | undefined>;
  label?: string;
  className?: string;
};

type RouteParams = {
  organizationId: string;
  workGroupJobTypeId?: string;
};

const mapStateToProps = (state: RootState) => state.autocompleteContractors;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupJobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchContractors: (page: number = 1, top: number = 10, inputValue?: string) =>
    workGroupJobTypeId
      ? dispatch(fetchAutocompleteNotAssignedContractors(organizationId, workGroupJobTypeId, inputValue, page, top))
      : dispatch(fetchAutocompleteContractors(organizationId, inputValue, page, top))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

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
    const { validate, label, className } = this.props;
    return (
      <AutocompleteContractorsField
        loadOptions={this.loadOptions}
        validate={validate}
        label={label}
        className={className}
      />
    );
  }
}

export const AutocompleteContractorsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutocompleteContractors)
);
