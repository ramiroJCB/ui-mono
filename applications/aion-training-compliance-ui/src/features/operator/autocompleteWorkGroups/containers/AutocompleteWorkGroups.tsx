import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AutocompleteWorkGroupsField } from '../component/AutocompleteWorkGroupsField';
import { connect } from 'react-redux';
import { fetchAutocompleteWorkGroups } from '../slice';
import { OptionType } from '@pec/aion-ui-form/types/option';
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

const mapStateToProps = (state: RootState) => state.autocompleteWorkGroups;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchAutocompleteWorkGroups: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchAutocompleteWorkGroups({ organizationId, inputValue, page, top }))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  OwnProps &
  RouteComponentProps<RouteParams>;

class AutocompleteWorkGroups extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: OptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<OptionType, SelectAdditional>> => {
    if (inputValue) {
      const payload = await this.props.fetchAutocompleteWorkGroups(page, 100, inputValue);
      return unwrapResult(payload);
    } else {
      const payload = await this.props.fetchAutocompleteWorkGroups(page, 100);
      return unwrapResult(payload);
    }
  };

  render() {
    const { label } = this.props;
    return <AutocompleteWorkGroupsField loadOptions={this.loadOptions} label={label} />;
  }
}

export const AutocompleteWorkGroupsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutocompleteWorkGroups)
);
