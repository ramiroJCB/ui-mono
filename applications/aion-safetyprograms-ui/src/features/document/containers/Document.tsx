import * as React from 'react';
import { connect } from 'react-redux';
import { DocumentComponent } from '../components/Document';
import { fetchDocument } from 'features/document/actions/fetchDocument';
import { fetchServerTokensIfNeeded } from '@pec/aion-ui-core/actions/serverTokens';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId?: string;
  documentMetadataId: string;
};

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

const mapStateToProps = ({
  document: { document, error: documentError, isFetching: isFetchingDocument },
  serverTokens: { serverTokens, error: serverTokensError, isFetching: isFetchingServerTokens }
}: RootState) => ({
  document,
  accessToken: serverTokens?.accessToken,
  error: documentError || serverTokensError,
  isFetching: isFetchingDocument || isFetchingServerTokens
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { documentMetadataId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchDocument: () => dispatch(fetchDocument(documentMetadataId)),
  fetchServerTokensIfNeeded: () => dispatch(fetchServerTokensIfNeeded())
});

class Component extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchServerTokensIfNeeded();
    props.fetchDocument();
  }

  render() {
    const {
      document,
      isFetching,
      error,
      accessToken,
      match: {
        params: { organizationId, documentMetadataId }
      }
    } = this.props;

    return (
      <DocumentComponent
        organizationId={organizationId}
        documentMetadataId={documentMetadataId}
        document={document}
        isFetching={isFetching}
        error={error}
        accessToken={accessToken}
      />
    );
  }
}

export const DocumentContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
