import * as React from 'react';
import { connect } from 'react-redux';
import { DocumentToolbarComponent } from '../components/Toolbar';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { ThunkDispatch } from 'redux-thunk';
import { updateDocumentScale } from '../actions/updateDocumentScale';

type OwnProps = {
  canChangePages: boolean;
  fileName: string;
  pageNumber: number;
  pdf: PDFDocumentProxy;
  setPageNumber: (pageNumber: number) => void;
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = ({ document: { scale } }: RootState) => ({
  scale
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  updateDocumentScale: (scale: number) => dispatch(updateDocumentScale(scale))
});

class Component extends React.Component<Props> {
  handleScale = (scale: number) => {
    this.props.updateDocumentScale(scale);
  };

  render() {
    const { canChangePages, fileName, pageNumber, pdf, setPageNumber, scale } = this.props;

    return (
      <DocumentToolbarComponent
        canChangePages={canChangePages}
        fileName={fileName}
        pageNumber={pageNumber}
        pdf={pdf}
        setPageNumber={setPageNumber}
        handleScale={this.handleScale}
        scale={scale}
      />
    );
  }
}

export const DocumentToolbarContainer = connect(mapStateToProps, mapDispatchToProps)(Component);
