import * as React from 'react';
import { AddWorkGroupJobTypeContractorForm } from '../components/AddWorkGroupJobTypeContractorsForm';
import { addWorkGroupJobTypeContractors } from '../actions/addWorkGroupJobTypeContractors';
import { connect } from 'react-redux';
import { fetchAutocompleteContractorsForValidation } from 'features/operator/autocompleteContractors/actions/fetchAutocompleteContractorsForValidation';
import { fetchWorkGroupJobTypeIfNeeded } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { FormApi } from 'final-form';
import { IAddWorkGroupJobTypeContractorForm } from 'interfaces/addWorkGroupJobTypeContractorForm';
import { IContractor } from 'interfaces/contractor';
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
  workGroupJobTypeId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupJobType;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, workGroupId, workGroupJobTypeId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  addWorkGroupJobTypeWithContractor: (contractors: IContractor[]) =>
    dispatch(addWorkGroupJobTypeContractors(history, organizationId, workGroupId, workGroupJobTypeId, contractors)),
  fetchAutocompleteContractorsForValidation: (values: IContractor[]) =>
    dispatch(fetchAutocompleteContractorsForValidation(values, workGroupJobTypeId)),
  fetchWorkGroupJobTypeIfNeeded: () => dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

export class AddWorkGroupJobTypeContractors extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeIfNeeded();
  }

  onSubmit = async (
    { contractors }: IAddWorkGroupJobTypeContractorForm,
    form: FormApi<IAddWorkGroupJobTypeContractorForm>
  ) => {
    await this.props.addWorkGroupJobTypeWithContractor(contractors);
    form.reset();
  };

  validate = async (values: IContractor[]) => {
    const { fetchAutocompleteContractorsForValidation, t } = this.props;

    if (!values.length) {
      return t('trainingCompliance.common.isRequired', 'is required');
    }

    if (values.length > 0) {
      try {
        const workGroupJobTypeContractors = await fetchAutocompleteContractorsForValidation(values);
        const invalidNames = workGroupJobTypeContractors.map(({ contractorName }) => contractorName);

        return workGroupJobTypeContractors.length ? (
          <PreviouslyAddedItems
            invalidNames={invalidNames}
            typeOfItem={t('trainingCompliance.operator.workGroupJobTypeContractors.contractors', 'contractors')}
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
    const { workGroupJobType, isFetching } = this.props;
    const initialValues: IAddWorkGroupJobTypeContractorForm = {
      contractors: []
    };

    return (
      <AddWorkGroupJobTypeContractorForm
        initialValues={initialValues}
        workGroupJobType={workGroupJobType}
        isFetching={isFetching}
        validate={this.validate}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export const AddWorkGroupJobTypeContractorsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddWorkGroupJobTypeContractors));
