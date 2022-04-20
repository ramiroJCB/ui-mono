import * as React from 'react';
import AddCompany from '../components/AddCompany';
import { addCompany } from '../actions/addCompany';
import { connect } from 'react-redux';
import { Error } from '@pec/aion-ui-components/components/Error';
import { History } from 'history';
import { ICompanyForm } from '../interfaces/companyForm';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { RootActions } from '../combineActions';
import { RootState } from '../combineReducers';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  history: History;
};

const mapStateToProps = (state: RootState) => state.company;

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>, { history }: OwnProps) => ({
  addCompany: (company: ICompanyForm) => dispatch(addCompany(company, history))
});

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

class AddCompanyContainer extends React.Component<Props> {
  onSubmit = async (companyForm: ICompanyForm) => await this.props.addCompany({ ...companyForm });

  render() {
    const { error, isFetching } = this.props;

    return !isFetching && !error ? <AddCompany onSubmit={this.onSubmit} /> : error ? <Error /> : <Loading />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCompanyContainer);
