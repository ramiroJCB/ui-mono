import * as React from 'react';
import { addTraining } from '../actions/addTraining';
import { AddTrainingForm } from '../components/AddTrainingForm';
import { connect } from 'react-redux';
import { FormApi } from 'final-form';
import { IAddTrainingForm } from 'interfaces/addTrainingForm';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  trainingRequirementId: string;
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    history,
    match: {
      params: { organizationId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  addTraining: (values: IAddTrainingForm) => dispatch(addTraining(history, organizationId, values))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddTraining extends React.Component<Props> {
  onSubmit = async (values: IAddTrainingForm, form: FormApi<IAddTrainingForm>) => {
    await this.props.addTraining(values);
    form.reset();
  };

  render() {
    const {
      match: {
        params: { organizationId }
      }
    } = this.props;
    const initialValues: IAddTrainingForm = {
      name: '',
      organizationId,
      description: '',
      expirationMillis: null,
      expirationUnits: null,
      uploadRequired: false
    };

    return <AddTrainingForm initialValues={initialValues} onSubmit={this.onSubmit} />;
  }
}

export const AddTrainingContainer = connect(
  null,
  mapDispatchToProps
)(AddTraining);
