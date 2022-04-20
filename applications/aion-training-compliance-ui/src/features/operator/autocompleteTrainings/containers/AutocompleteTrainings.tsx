import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AutocompleteTrainingsField } from '../component/AutocompleteTrainingsField';
import { connect } from 'react-redux';
import { fetchAutocompleteTrainings } from '../actions/fetchAutocompleteTrainings';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { ThunkDispatch } from 'redux-thunk';
import { TrainingOptionType } from 'interfaces/trainingOption';

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  validate?: (values: ITrainingRequirement[]) => Promise<JSX.Element | string | undefined>;
  label?: string;
  className?: string;
};

const mapStateToProps = (state: RootState) => state.autocompleteTrainings;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchTrainings: (page: number = 1, top: number = 10, inputValue?: string) =>
    dispatch(fetchAutocompleteTrainings(organizationId, inputValue, page, top))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  OwnProps &
  RouteComponentProps<RouteParams>;

class AutocompleteTrainings extends React.Component<Props> {
  loadOptions = async (
    inputValue: string,
    _prevOptions: TrainingOptionType[],
    { page }: SelectAdditional
  ): Promise<AsyncResult<TrainingOptionType, SelectAdditional>> =>
    inputValue ? await this.props.fetchTrainings(page, 100, inputValue) : await this.props.fetchTrainings(page, 100);

  render() {
    const { validate, label, className } = this.props;

    return (
      <AutocompleteTrainingsField
        loadOptions={this.loadOptions}
        validate={validate}
        label={label}
        className={className}
      />
    );
  }
}

export const AutocompleteTrainingsContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AutocompleteTrainings)
);
