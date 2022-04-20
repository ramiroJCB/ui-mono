import * as React from 'react';
import { AddWorkGroupJobTypeForm } from '../components/AddWorkGroupJobTypeForm';
import { addWorkGroupJobTypes } from '../actions/addWorkGroupJobTypes';
import { connect } from 'react-redux';
import { fetchAutocompleteJobTypesForValidation } from 'features/operator/autocompleteJobTypes/actions/fetchAutocompleteJobTypesForValidation';
import { fetchWorkGroupIfNeeded } from 'features/operator/workGroup/actions/fetchWorkGroup';
import { FormApi } from 'final-form';
import { IAddWorkGroupJobTypeForm } from 'interfaces/addWorkGroupJobTypeForm';
import { IJobType } from '@pec/aion-ui-core/interfaces/jobType';
import { PreviouslyAddedItems } from 'components/PreviouslyAddedItems';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  workGroupId: string;
};

const mapStateToProps = (state: RootState) => state.workGroup;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  addWorkGroupWithJobType: (jobTypes: IJobType[]) =>
    dispatch(addWorkGroupJobTypes(history, organizationId, workGroupId, jobTypes)),
  fetchAutocompleteJobTypesForValidation: (values: IJobType[]) =>
    dispatch(fetchAutocompleteJobTypesForValidation(values, workGroupId)),
  fetchWorkGroupIfNeeded: () => dispatch(fetchWorkGroupIfNeeded(workGroupId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

export class AddWorkGroupJobType extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupIfNeeded();
  }

  onSubmit = async ({ jobTypes }: IAddWorkGroupJobTypeForm, form: FormApi<IAddWorkGroupJobTypeForm>) => {
    await this.props.addWorkGroupWithJobType(jobTypes);
    form.reset();
  };

  validate = async (values: IJobType[]) => {
    const { fetchAutocompleteJobTypesForValidation, t } = this.props;

    if (!values.length) {
      return t('trainingCompliance.common.isRequired', 'is required');
    }

    if (values.length > 0) {
      try {
        const workGroupJobTypes = await fetchAutocompleteJobTypesForValidation(values);
        const invalidNames = workGroupJobTypes.map(({ jobTypeName }) => jobTypeName);

        return workGroupJobTypes.length ? (
          <PreviouslyAddedItems
            invalidNames={invalidNames}
            typeOfItem={t('trainingCompliance.operator.workGroupJobTypes.jobTypes', 'job types')}
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
    const { workGroup, isFetching } = this.props;
    const initialValues: IAddWorkGroupJobTypeForm = {
      jobTypes: []
    };

    return (
      <AddWorkGroupJobTypeForm
        initialValues={initialValues}
        workGroup={workGroup}
        isFetching={isFetching}
        validate={this.validate}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export const AddWorkGroupJobTypeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddWorkGroupJobType));
