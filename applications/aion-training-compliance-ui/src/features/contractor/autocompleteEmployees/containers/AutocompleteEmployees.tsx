import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AutocompleteEmployeesField } from '../components/AutocompleteEmployeesField';
import { connect } from 'react-redux';
import { fetchAutocompleteEmployees } from '../actions/fetchAutocompleteEmployees';
import { IEmployee } from 'interfaces/employee';
import { OptionType } from '@pec/aion-ui-form/types/option';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  validate?: (values: IEmployee[]) => Promise<JSX.Element | string | undefined>;
};

type RouteParams = {
  organizationId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = (state: RootState) => state.autocompleteEmployees;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupJobTypeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchEmployees: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchAutocompleteEmployees(organizationId, workGroupJobTypeId, inputValue, page, top))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class AutocompleteEmployees extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: OptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<OptionType, SelectAdditional>> =>
    inputValue ? await this.props.fetchEmployees(page, 100, inputValue) : await this.props.fetchEmployees(page, 100);

  render() {
    const { validate } = this.props;
    return <AutocompleteEmployeesField loadOptions={this.loadOptions} validate={validate} />;
  }
}

export const AutocompleteEmployeesContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutocompleteEmployees)
);
