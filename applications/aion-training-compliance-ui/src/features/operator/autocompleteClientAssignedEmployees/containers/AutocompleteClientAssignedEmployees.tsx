import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AutocompleteClientAssignedEmployeesField } from '../component/AutocompleteClientAssignedEmployeesField';
import { connect } from 'react-redux';
import { fetchAutocompleteClientAssignedEmployees } from '../slice';
import { IClientAssignedEmployee } from 'interfaces/clientAssignedEmployee';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';
import { unwrapResult } from '@reduxjs/toolkit';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  label?: string;
};

const mapStateToProps = (state: RootState) => state.autocompleteClientAssignedEmployees;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchAutocompleteClientAssignedEmployees: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchAutocompleteClientAssignedEmployees({ organizationId, inputValue, page, top }))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  OwnProps &
  RouteComponentProps<RouteParams>;

class AutocompleteClientAssignedEmployees extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: IClientAssignedEmployee[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<IClientAssignedEmployee, SelectAdditional>> => {
    if (inputValue) {
      const payload = await this.props.fetchAutocompleteClientAssignedEmployees(page, 100, inputValue);
      return unwrapResult(payload);
    } else {
      const payload = await this.props.fetchAutocompleteClientAssignedEmployees(page, 100);
      return unwrapResult(payload);
    }
  };

  render() {
    const { label } = this.props;
    return <AutocompleteClientAssignedEmployeesField loadOptions={this.loadOptions} label={label} />;
  }
}

export const AutocompleteClientAssignedEmployeesContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutocompleteClientAssignedEmployees)
);
