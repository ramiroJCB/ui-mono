import * as React from 'react';
import { addJobType } from 'features/operator/jobType/actions/addJobType';
import { AddJobTypeForm } from '../components/AddJobTypeForm';
import { connect } from 'react-redux';
import { fetchJobTypesForValidation } from '../../jobTypes/actions';
import { FormApi } from 'final-form';
import { IAddJobTypeForm } from 'interfaces/addJobTypeForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId }
    },
    history
  }: RouteComponentProps<RouteParams>
) => ({
  addJobType: (values: IAddJobTypeForm) => dispatch(addJobType(history, organizationId, values)),
  fetchJobTypesForValidation: (name: string) => dispatch(fetchJobTypesForValidation(organizationId, name))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddJobType extends React.Component<Props> {
  onSubmit = async (values: IAddJobTypeForm, form: FormApi<IAddJobTypeForm>) => {
    await this.props.addJobType(values);
    form.reset();
  };

  render() {
    const {
      match: {
        params: { organizationId }
      },
      fetchJobTypesForValidation
    } = this.props;

    const initialValues: IAddJobTypeForm = {
      name: '',
      organizationId: organizationId,
      description: null,
      trainings: []
    };

    return (
      <AddJobTypeForm
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        fetchJobTypesForValidation={fetchJobTypesForValidation}
      />
    );
  }
}

export const AddJobTypeContainer = connect(
  null,
  mapDispatchToProps
)(AddJobType);
