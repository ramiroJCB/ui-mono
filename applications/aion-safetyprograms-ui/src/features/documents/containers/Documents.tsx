import * as React from 'react';
import { connect } from 'react-redux';
import { DocumentsComponent } from '../components/Documents';
import { RootState } from 'combineReducers';

type OwnProps = {
  isContractor: boolean;
  organizationId?: string;
};

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const mapStateToProps = ({
  documents: { documents, isFetching: isFetchingDocuments, error: documentsError },
  filters: { isFetching: isFetchingFilters, error: filtersError }
}: RootState) => ({
  documents,
  isFetching: isFetchingDocuments || isFetchingFilters,
  error: documentsError || filtersError
});

const Component: React.FC<Props> = ({ isContractor, isFetching, error, organizationId }) => (
  <DocumentsComponent
    isContractor={isContractor}
    isFetching={isFetching}
    error={error}
    organizationId={organizationId}
  />
);

export const DocumentsContainer = connect(mapStateToProps)(Component);
