import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AutocompleteServiceRegionsField } from '../components/AutocompleteServiceRegionsField';
import { connect } from 'react-redux';
import { fetchAutocompleteServiceRegions } from '../actions/fetchAutocompleteServiceRegions';
import { IServiceRegion } from '@pec/aion-ui-core/interfaces/serviceRegion';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  validate?: (values: IServiceRegion[]) => Promise<JSX.Element | string | undefined>;
};

type RouteParams = {
  organizationId: string;
};

const mapStateToProps = (autocompleteServiceRegions: RootState) => autocompleteServiceRegions;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  fetchAutocompleteServiceRegions: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchAutocompleteServiceRegions(inputValue, page, top))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class AutocompleteJobTypes extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: IServiceRegion[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<IServiceRegion, SelectAdditional>> =>
    inputValue
      ? await this.props.fetchAutocompleteServiceRegions(page, 100, inputValue)
      : await this.props.fetchAutocompleteServiceRegions(page, 100);

  render() {
    const { validate } = this.props;
    return <AutocompleteServiceRegionsField loadOptions={this.loadOptions} validate={validate} />;
  }
}

export const AutocompleteServiceRegionsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutocompleteJobTypes)
);
