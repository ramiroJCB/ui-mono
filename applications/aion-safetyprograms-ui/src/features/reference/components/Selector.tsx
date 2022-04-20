import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ReactCrop, { Crop, PercentCrop } from 'react-image-crop';
import Typography from '@material-ui/core/Typography';
import { Artboard } from 'features/document/components/Artboard';
import { Document } from 'react-pdf';
import { DocumentToolbarContainer } from 'features/document/containers/Toolbar';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { ScaledPage } from 'features/document/containers/ScaledPage';
import { styles } from 'features/document/components/Viewer';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type OwnProps = {
  fileName: string;
  file: {
    url: string;
    httpHeaders: {
      Authorization: string;
      'X-Aion-OrganizationId'?: string;
    };
  };
  pageNumber: number;
  handleSubmit?: (pageNumber: number, crop: PercentCrop) => void;
  crop?: PercentCrop;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  pageNumber: number;
  crop?: PercentCrop;
  dataURL?: string;
  pdf?: PDFDocumentProxy;
  error?: Error;
};

// react-image-crop uses floats, which may slightly differ from saved values
const areCloseEnough = (a = 0, b = 0) => Math.abs(a - b) < 1e-6;

class Component extends React.Component<Props, State> {
  reactPDFPageRef: HTMLDivElement | null;

  constructor(props: Props) {
    super(props);
    this.reactPDFPageRef = null;
    this.state = {
      pageNumber: props.pageNumber,
      crop: props.crop
    };
  }

  setDataURL = () => {
    this.setState({
      dataURL: this.reactPDFPageRef?.querySelector('canvas')?.toDataURL() || undefined
    });
  };

  handleCrop = (_absoluteCrop: Crop, crop: PercentCrop) => {
    // Use a percentage, so scale and window size don't affect the selection
    this.setState({ crop });
  };

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

  selectionHasChanged = () => {
    const { crop: initialCrop, pageNumber: initialPageNumber } = this.props;
    const { crop, pageNumber } = this.state;

    return (
      crop &&
      (initialPageNumber !== pageNumber ||
        !initialCrop ||
        !areCloseEnough(initialCrop.x, crop.x) ||
        !areCloseEnough(initialCrop.y, crop.y) ||
        !areCloseEnough(initialCrop.width, crop.width) ||
        !areCloseEnough(initialCrop.height, crop.height))
    );
  };

  handleSubmit = () => {
    const { pageNumber, crop } = this.state;
    const { handleSubmit } = this.props;

    if (crop && handleSubmit) {
      handleSubmit(pageNumber, crop);
    }
  };

  handleClickReset = () => {
    const { pageNumber, crop } = this.props;

    this.setState({ pageNumber, crop });
  };

  render() {
    const { classes, handleSubmit, crop: initialCrop, fileName, file, t } = this.props;
    const { pageNumber, crop, dataURL, pdf, error } = this.state;

    return (
      <React.Fragment>
        {handleSubmit && (
          <Grid item xs={4} style={{ padding: 0 }}>
            <GridContainer justify="flex-end">
              {initialCrop && (
                <Grid item>
                  <Button disabled={!this.selectionHasChanged()} onClick={this.handleClickReset}>
                    {t('safetyPrograms.common.reset', 'Reset')}
                  </Button>
                </Grid>
              )}
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={!crop?.width || !crop?.height || !this.selectionHasChanged()}
                  onClick={this.handleSubmit}
                >
                  {t('safetyPrograms.reference.saveSelection', 'Save Selection')}
                </Button>
              </Grid>
            </GridContainer>
          </Grid>
        )}
        <Grid item xs={12}>
          <Paper elevation={0} isLoading={!pdf} hasError={!!error}>
            <GridContainer style={{ padding: 0 }} justify="space-between" alignItems="center">
              {pdf && (
                <React.Fragment>
                  <DocumentToolbarContainer
                    canChangePages={!!handleSubmit}
                    fileName={fileName}
                    pageNumber={pageNumber}
                    pdf={pdf}
                    setPageNumber={this.setPageNumber}
                  />
                  {handleSubmit && (
                    <Grid item>
                      <Typography color="secondary">
                        {t(
                          'safetyPrograms.reference.clickDragPdf',
                          'Click and drag on the PDF to highlight the area that supports your answer.'
                        )}
                      </Typography>
                    </Grid>
                  )}
                </React.Fragment>
              )}
              <Artboard>
                {({ pageWidth, pageHeight }) => (
                  <React.Fragment>
                    {dataURL && (
                      <ReactCrop
                        src={dataURL}
                        onChange={this.handleCrop}
                        crop={crop}
                        disabled={!handleSubmit}
                        className={classes.page}
                      />
                    )}
                    <div style={{ display: 'none' }}>
                      <Document file={file} onLoadSuccess={this.setPDF} onLoadError={this.setError}>
                        <ScaledPage
                          pageNumber={pageNumber}
                          width={pageWidth}
                          height={pageHeight}
                          inputRef={ref => (this.reactPDFPageRef = ref)}
                          onRenderSuccess={this.setDataURL}
                        />
                      </Document>
                    </div>
                  </React.Fragment>
                )}
              </Artboard>
            </GridContainer>
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }
}

export const ReferenceSelector = withStyles(styles)(withTranslation()(Component));
