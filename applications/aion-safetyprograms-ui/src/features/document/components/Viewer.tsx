import * as React from 'react';
import { Artboard } from 'features/document/components/Artboard';
import { Document } from 'react-pdf';
import { DocumentToolbarContainer } from 'features/document/containers/Toolbar';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { ScaledPage } from '../containers/ScaledPage';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

export const styles = (theme: Theme) => ({
  document: {
    display: 'inline-block'
  },
  page: {
    boxShadow: theme.shadows[2],
    '& > .ReactCrop__crop-selection': {
      boxShadow: `0 0 0 9999em ${theme.palette.action.focus}`
    }
  }
});

type OwnProps = {
  fileName: string;
  file: {
    url: string;
    httpHeaders: {
      Authorization: string;
      'X-Aion-OrganizationId'?: string;
    };
  };
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  pageNumber: number;
  pdf?: PDFDocumentProxy;
  error?: Error;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pageNumber: 1
    };
  }

  setPDF = (pdf: PDFDocumentProxy) => {
    this.setState({ pdf });
  };

  setError = (error: Error) => {
    this.setState({ error });
  };

  setPageNumber = (pageNumber: number) => {
    this.setState({
      pageNumber
    });
  };

  render() {
    const { fileName, file, classes, t } = this.props;
    const { pageNumber, pdf, error } = this.state;

    return (
      <GridContainer>
        {pdf && (
          <DocumentToolbarContainer
            canChangePages={true}
            fileName={fileName}
            pageNumber={pageNumber}
            pdf={pdf}
            setPageNumber={this.setPageNumber}
          />
        )}
        <Artboard>
          {({ pageWidth, pageHeight }) => (
            <Document
              file={file}
              onLoadSuccess={this.setPDF}
              onLoadError={this.setError}
              className={classes.document}
              loading={t('safetyPrograms.document.loadingText', 'Loading PDF…')}
              error={t('safetyPrograms.document.failedToLoadPDF', 'Failed to load PDF file.')}
              noData={t('safetyPrograms.document.noPDFSpecified', 'No PDF file specified.')}
            >
              {error ? (
                <React.Fragment>
                  {t('safetyPrograms.document.error', {
                    fileName,
                    defaultValue: 'There was an error loading {{fileName}}'
                  })}
                </React.Fragment>
              ) : (
                <ScaledPage pageNumber={pageNumber} width={pageWidth} height={pageHeight} className={classes.page} />
              )}
            </Document>
          )}
        </Artboard>
      </GridContainer>
    );
  }
}

export const DocumentViewer = withStyles(styles)(withTranslation()(Component));
