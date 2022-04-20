import * as React from 'react';
import { AddJobTypeTrainingRequirementForm } from '../components/AddJobTypeTrainingRequirementForm';
import { addJobTypeTrainingRequirements } from '../actions/addJobTypeTrainingRequirements';
import { connect } from 'react-redux';
import { fetchAutocompleteTrainingsForValidation } from 'features/operator/autocompleteTrainings/actions/fetchAutocompleteTrainingsForValidation';
import { fetchJobTypeIfNeeded } from '../../jobType/actions/fetchJobType';
import { FormApi } from 'final-form';
import { IAddJobTypeTrainingRequirementForm } from 'interfaces/addJobTypeTrainingRequirementForm';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { PreviouslyAddedItems } from 'components/PreviouslyAddedItems';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  jobTypeId: string;
};

const mapStateToProps = (state: RootState) => state.jobType;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, jobTypeId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  addJobTypeWithTraining: (trainings: ITrainingRequirement[]) =>
    dispatch(addJobTypeTrainingRequirements(history, organizationId, jobTypeId, trainings)),
  fetchAutocompleteTrainingsForValidation: (values: ITrainingRequirement[]) =>
    dispatch(fetchAutocompleteTrainingsForValidation(values, jobTypeId)),
  fetchJobTypeIfNeeded: () => dispatch(fetchJobTypeIfNeeded(jobTypeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

export class AddJobTypeTrainingRequirements extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchJobTypeIfNeeded();
  }

  onSubmit = async (
    { trainings }: IAddJobTypeTrainingRequirementForm,
    form: FormApi<IAddJobTypeTrainingRequirementForm>
  ) => {
    await this.props.addJobTypeWithTraining(trainings);
    form.reset();
  };

  validate = async (values: ITrainingRequirement[]) => {
    const { fetchAutocompleteTrainingsForValidation, t } = this.props;

    if (!values.length) {
      return t('trainingCompliance.common.isRequired', 'is required');
    }

    if (values.length > 0) {
      try {
        const jobTypeTrainingRequirements = await fetchAutocompleteTrainingsForValidation(values);
        const invalidNames = jobTypeTrainingRequirements.map(({ trainingRequirementName }) => trainingRequirementName);

        return jobTypeTrainingRequirements.length ? (
          <PreviouslyAddedItems
            invalidNames={invalidNames}
            typeOfItem={t('trainingCompliance.operator.jobTypeTrainingRequirements.requirements', 'requirements')}
          />
        ) : (
          undefined
        );
      } catch {
        return t('trainingCompliance.common.errorProcessingValidationRequest', 'error processing validation request');
      }
    } else {
      return undefined;
    }
  };

  render() {
    const { jobType, isFetching } = this.props;
    const initialValues: IAddJobTypeTrainingRequirementForm = {
      trainings: []
    };

    return (
      <AddJobTypeTrainingRequirementForm
        initialValues={initialValues}
        jobType={jobType}
        isFetching={isFetching}
        validate={this.validate}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export const AddJobTypeTrainingRequirementsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddJobTypeTrainingRequirements));
