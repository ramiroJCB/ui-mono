import * as React from 'react';
import { addWorkGroup } from '../actions/addWorkGroup';
import { AddWorkGroupForm } from '../components/AddWorkGroupForm';
import { connect } from 'react-redux';
import { fetchWorkGroupsForValidation } from '@pec/aion-ui-core/actions/fetchWorkGroups';
import { FormApi } from 'final-form';
import { IAddWorkGroupForm } from 'interfaces/addWorkGroupForm';
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
  addWorkGroup: (values: IAddWorkGroupForm) => dispatch(addWorkGroup(history, organizationId, values)),
  fetchWorkGroupsForValidation: (name: string) => dispatch(fetchWorkGroupsForValidation(organizationId, name))
});

type Props = ReturnType<typeof mapDispatchToProps> & RouteComponentProps<RouteParams>;

class AddWorkGroup extends React.Component<Props> {
  onSubmit = async (values: IAddWorkGroupForm, form: FormApi<IAddWorkGroupForm>) => {
    await this.props.addWorkGroup(values);
    form.reset();
  };

  render() {
    const {
      match: {
        params: { organizationId }
      },
      fetchWorkGroupsForValidation
    } = this.props;

    const initialValues: IAddWorkGroupForm = {
      name: '',
      organizationId: organizationId,
      description: null,
      jobTypes: [],
      serviceRegions: []
    };

    return (
      <AddWorkGroupForm
        initialValues={initialValues}
        onSubmit={this.onSubmit}
        fetchWorkGroupsForValidation={fetchWorkGroupsForValidation}
      />
    );
  }
}

export const AddWorkGroupContainer = connect(null, mapDispatchToProps)(AddWorkGroup);
