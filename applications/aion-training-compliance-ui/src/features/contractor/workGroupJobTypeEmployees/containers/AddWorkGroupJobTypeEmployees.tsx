import * as React from 'react';
import { AddWorkGroupJobTypeEmployeeForm } from '../components/AddWorkGroupJobTypeEmployeesForm';
import { addWorkGroupJobTypeEmployees } from '../../../workGroupJobTypeEmployees/actions/addWorkGroupJobTypeEmployees';
import { connect } from 'react-redux';
import { fetchAutocompleteEmployeesForValidation } from 'features/contractor/autocompleteEmployees/actions/fetchAutocompleteEmployeesForValidation';
import { fetchWorkGroupJobTypeIfNeeded } from 'features/workGroupJobType/actions/fetchWorkGroupJobType';
import { FormApi } from 'final-form';
import { IAddWorkGroupJobTypeEmployeeForm } from 'interfaces/addWorkGroupJobTypeEmployeeForm';
import { IEmployee } from 'interfaces/employee';
import { PreviouslyAddedItems } from 'components/PreviouslyAddedItems';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
  clientId: string;
  workGroupContractorId: string;
  workGroupJobTypeId: string;
};

const mapStateToProps = (state: RootState) => state.workGroupJobType;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, clientId, workGroupContractorId, workGroupJobTypeId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  addWorkGroupJobTypeWithEmployee: (employees: IEmployee[]) =>
    dispatch(
      addWorkGroupJobTypeEmployees(
        history,
        organizationId,
        clientId,
        workGroupContractorId,
        workGroupJobTypeId,
        employees
      )
    ),
  fetchAutocompleteEmployeesForValidation: (values: IEmployee[]) =>
    dispatch(fetchAutocompleteEmployeesForValidation(values, workGroupJobTypeId)),
  fetchWorkGroupJobTypeIfNeeded: () => dispatch(fetchWorkGroupJobTypeIfNeeded(workGroupJobTypeId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  I18nextProps;

export class AddWorkGroupJobTypeEmployees extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchWorkGroupJobTypeIfNeeded();
  }

  onSubmit = async (
    { employees }: IAddWorkGroupJobTypeEmployeeForm,
    form: FormApi<IAddWorkGroupJobTypeEmployeeForm>
  ) => {
    await this.props.addWorkGroupJobTypeWithEmployee(employees);
    form.reset();
  };

  validate = async (values: IEmployee[]) => {
    const { fetchAutocompleteEmployeesForValidation, t } = this.props;

    if (!values.length) {
      return t('trainingCompliance.common.isRequired', 'is required');
    }

    if (values.length > 0) {
      try {
        const workGroupJobTypeEmployees = await fetchAutocompleteEmployeesForValidation(values);
        const invalidNames = workGroupJobTypeEmployees.map(({ employeeName }) => employeeName);

        return workGroupJobTypeEmployees.length ? (
          <PreviouslyAddedItems
            invalidNames={invalidNames}
            typeOfItem={t('trainingCompliance.contractor.workGroupJobTypeEmployees.employees', 'employees')}
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
    const initialValues: IAddWorkGroupJobTypeEmployeeForm = {
      employees: []
    };

    return (
      <AddWorkGroupJobTypeEmployeeForm
        initialValues={initialValues}
        workGroupJobType={workGroupJobType}
        isFetching={isFetching}
        validate={this.validate}
        onSubmit={this.onSubmit}
      />
    );
  }
}

export const AddWorkGroupJobTypeEmployeesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AddWorkGroupJobTypeEmployees));
