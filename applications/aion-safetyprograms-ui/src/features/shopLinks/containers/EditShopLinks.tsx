import * as React from 'react';
import { connect } from 'react-redux';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { fetchAllSafetyPrograms } from 'features/safetyPrograms/actions/fetchSafetyPrograms';
import { RouteComponentProps } from 'react-router-dom';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { IEditShopLinksForm } from 'interfaces/safetyProgram';
import { ShopLinksFormContainer } from './ShopLinksForm';
import { updateShopLinks } from '../actions/updateShopLinks';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

const mapStateToProps = ({ safetyPrograms: { safetyPrograms, isFetching, error } }: RootState) => ({
  safetyPrograms,
  isFetching,
  error
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { location: { search } }: RouteComponentProps
) => ({
  fetchSafetyPrograms: () => {
    const { searchTerm = '', orderby = 'title' } = parse(search);
    dispatch(fetchAllSafetyPrograms(searchTerm.toString(), orderby));
  },
  updateShopLinks: (values: IEditShopLinksForm) => {
    dispatch(updateShopLinks(values));
  }
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSafetyPrograms();
  }

  onSubmit = async (values: IEditShopLinksForm) => {
    const { updateShopLinks, history } = this.props;
    await updateShopLinks(values);
    this.props.fetchSafetyPrograms();
    history.push('/safety-programs');
  };

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchSafetyPrograms,
      location: { search }
    } = this.props;
    if (search !== prevSearch) {
      fetchSafetyPrograms();
    }
  }

  handleHeaderClick = (orderby: string) => () => {
    const {
      history,
      location: { search }
    } = this.props;

    history.push({
      search: merge(search, {
        orderby
      })
    });
  };

  render() {
    const {
      location: { search },
      isFetching,
      error,
      safetyPrograms
    } = this.props;

    const { orderby = 'title desc' } = parse(search);

    return (
      <ShopLinksFormContainer
        handleHeaderClick={this.handleHeaderClick}
        orderby={orderby.toString()}
        safetyPrograms={safetyPrograms}
        isFetching={isFetching}
        onSubmit={this.onSubmit}
        error={error}
      />
    );
  }
}

export const EditShopLinksContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
