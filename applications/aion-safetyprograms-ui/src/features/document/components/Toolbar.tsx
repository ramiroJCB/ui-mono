import * as React from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FileSaver from 'file-saver';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

const styles = (theme: Theme) => ({
  inputAdornment: {
    alignItems: 'normal',
    color: theme.palette.action.active
  },
  readOnlyPageNumber: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2)
  }
});

type OwnProps = {
  canChangePages: boolean;
  fileName: string;
  pageNumber: number;
  pdf: PDFDocumentProxy;
  setPageNumber: (pageNumber: number) => void;
  handleScale: (scale: number) => void;
  scale: number;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  pageNumberInputValue: string;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pageNumberInputValue: props.pageNumber.toString()
    };
  }

  handleClickDownload = async () => {
    const { fileName, pdf } = this.props;
    const data = await pdf.getData();
    const blob = new Blob([data]);

    FileSaver.saveAs(blob, fileName);
  };

  stepPageNumber = (step: number) => () => {
    const { pageNumber, setPageNumber } = this.props;
    const nextNumber = pageNumber + step;

    this.setState(
      {
        pageNumberInputValue: nextNumber.toString()
      },
      () => setPageNumber(nextNumber)
    );
  };

  stepScale = (step: number) => () => {
    const { handleScale, scale } = this.props;

    handleScale(scale + step);
  };

  handleChangePageNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      pageNumberInputValue: event.target.value
    });
  };

  handleSubmitPageNumber = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      setPageNumber,
      pdf: { numPages }
    } = this.props;
    const numericValue = Number(this.state.pageNumberInputValue);

    if (numericValue >= 1 && numericValue <= numPages) {
      setPageNumber(numericValue);
    }
  };

  render() {
    const {
      canChangePages,
      pageNumber,
      pdf: { numPages },
      classes,
      scale,
      t
    } = this.props;

    return (
      <Grid item>
        <form onSubmit={this.handleSubmitPageNumber}>
          {canChangePages ? (
            <React.Fragment>
              <Tooltip title={t('safetyPrograms.document.previousPage', 'Previous Page').toString()}>
                <span>
                  <IconButton edge="start" onClick={this.stepPageNumber(-1)} disabled={pageNumber === 1}>
                    <ChevronLeftIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <TextField
                variant="filled"
                label={t('safetyPrograms.document.page', 'Page')}
                inputProps={{ size: numPages.toString().length }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" className={classes.inputAdornment}>
                      / {localizeNumber(numPages, t)}
                    </InputAdornment>
                  )
                }}
                value={this.state.pageNumberInputValue}
                onChange={this.handleChangePageNumberInput}
                size="small"
              />
              <Tooltip title={t('safetyPrograms.document.nextPage', 'Next Page').toString()}>
                <span>
                  <IconButton onClick={this.stepPageNumber(1)} disabled={pageNumber === numPages}>
                    <ChevronRightIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </React.Fragment>
          ) : (
            <Typography component="span" className={classes.readOnlyPageNumber}>
              {t('safetyPrograms.document.pageNumeration', {
                pageNumber: localizeNumber(pageNumber, t),
                numPages: localizeNumber(numPages, t),
                defaultValue: 'Page {{pageNumber}} / {{numPages}}'
              })}
            </Typography>
          )}
          <Tooltip title={t('safetyPrograms.document.zoomIn', 'Zoom In').toString()}>
            <span>
              <IconButton onClick={this.stepScale(0.1)} disabled={scale >= 0.9}>
                <ZoomInIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('safetyPrograms.document.zoomOut', 'Zoom Out').toString()}>
            <span>
              <IconButton onClick={this.stepScale(-0.1)} disabled={scale <= 0.2}>
                <ZoomOutIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t('safetyPrograms.document.downloadPDF', 'Download PDF').toString()}>
            <span>
              <IconButton onClick={this.handleClickDownload}>
                <SaveAltIcon />
              </IconButton>
            </span>
          </Tooltip>
        </form>
      </Grid>
    );
  }
}

export const DocumentToolbarComponent = withStyles(styles)(withTranslation()(Component));
