import * as React from 'react';
import { $top, fetchDocuments } from '../actions/fetchDocuments';
import { connect } from 'react-redux';
import { ContractorDocumentsTableComponent } from '../components/ContractorDocumentsTable';
import { DocumentsTableComponent } from '../components/DocumentsTable';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type OwnProps = {
  isContractor: boolean;
  organizationId?: string;
  basepath: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps &
  OwnProps;

const mapStateToProps = (state: RootState) => state.documents;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  { isContractor, organizationId, location: { search } }: RouteComponentProps & OwnProps
) => ({
  fetchDocuments: (page: number, searchTerm: string, $orderby: string) =>
    dispatch(
      isContractor && organizationId
        ? fetchDocuments(organizationId, page, searchTerm, $orderby)
        : fetchDocuments(parse(search)?.contractor?.toString() || '', page, searchTerm, $orderby, organizationId)
    )
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchDocuments(0, props.searchTerm, props.$orderby);
  }

  componentDidUpdate({ location: { search: prevSearch } }: Props) {
    const {
      fetchDocuments,
      location: { search },
      searchTerm,
      $orderby
    } = this.props;

    if (search !== prevSearch) {
      fetchDocuments(0, searchTerm, $orderby);
    }
  }

  handleSearch = (searchTerm: string) => {
    const { fetchDocuments, $orderby } = this.props;
    fetchDocuments(0, searchTerm, $orderby);
  };

  handleHeaderClick = ($orderby: string) => () => {
    const { fetchDocuments, searchTerm } = this.props;
    fetchDocuments(0, searchTerm, $orderby);
  };

  handlePageChange = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, page: number) => {
    const { fetchDocuments, searchTerm, $orderby } = this.props;
    fetchDocuments(page, searchTerm, $orderby);
  };

  render() {
    const { isContractor, basepath, documents, isFetching, page, searchTerm, $orderby, total } = this.props;

    return isContractor ? (
      <ContractorDocumentsTableComponent
        basepath={basepath}
        documents={documents}
        isFetching={isFetching}
        page={page}
        searchTerm={searchTerm}
        $orderby={$orderby}
        total={total}
        rowsPerPage={$top}
        handleSearch={this.handleSearch}
        handleHeaderClick={this.handleHeaderClick}
        onChangePage={this.handlePageChange}
      />
    ) : (
      <DocumentsTableComponent
        basepath={basepath}
        documents={documents}
        isFetching={isFetching}
        page={page}
        searchTerm={searchTerm}
        $orderby={$orderby}
        total={total}
        rowsPerPage={$top}
        handleSearch={this.handleSearch}
        handleHeaderClick={this.handleHeaderClick}
        onChangePage={this.handlePageChange}
      />
    );
  }
}

export const DocumentsTableContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(Component));
