import * as React from 'react';
import amber from '@material-ui/core/colors/amber';
import Button from '@material-ui/core/Button';
import Dropzone from 'react-dropzone';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { ErrorButton } from 'components/ErrorButton';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { Prompt } from '@pec/aion-ui-components/components/Prompt';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { Trans, withTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    fileName: {
      overflowWrap: 'anywhere'
    },
    upload: {
      cursor: 'pointer',
      '&:hover': {
        background: theme.palette.action.hover
      }
    }
  });

type OwnProps = {
  handleUpload: (file: File, newFileName?: string) => void;
  handleCancelUpload: () => void;
  handleReset: () => void;
  isUploading: boolean;
  progress: number;
  error: DeepReadonly<AxiosError> | null;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  file?: File;
  newFileName?: string;
  invalidFile: boolean;
  confirmingCancel: boolean;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      file: undefined,
      newFileName: undefined,
      invalidFile: false,
      confirmingCancel: false
    };
  }

  handleDrop = (acceptedFiles: File[]) => {
    const [file] = acceptedFiles;

    this.props.handleReset();
    this.setState({
      file,
      invalidFile: !file
    });
  };

  resumeUpload = () => {
    this.setState({ confirmingCancel: false });
  };

  cancelUpload = () => {
    this.props.handleCancelUpload();
    this.setState({ confirmingCancel: false });
  };

  confirmCancel = () => {
    this.setState({ confirmingCancel: true });
  };

  reset = () => {
    this.props.handleReset();
    this.setState({ file: undefined, newFileName: undefined });
  };

  startUpload = () => {
    const { file, newFileName } = this.state;

    if (file) {
      this.props.handleUpload(file, newFileName);
    }
  };

  startRenamedUpload = (newFileName: string) => () => {
    this.setState({ newFileName }, this.startUpload);
  };

  render() {
    const { isUploading, progress, error, classes, t } = this.props;
    const { file, invalidFile, confirmingCancel, newFileName } = this.state;
    const {
      key: errorKey,
      data: { newFileName: suggestedFileName }
    } = (error && error.response && JSON.parse(error?.response?.data)) || { data: {} };

    return (
      <Paper variant="outlined" style={{ padding: 0 }}>
        {file ? (
          <GridContainer>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="secondary" paragraph>
                {t('safetyPrograms.common.orUploadNewDocument', 'Or Upload a New Document')}
              </Typography>
              {isUploading ? (
                <GridContainer justify="space-between">
                  <Prompt
                    when={progress < 100}
                    message={t(
                      'safetyPrograms.document.leaveConfirmation',
                      'Are you sure you want to leave? Your upload will be canceled.'
                    )}
                  />
                  <Grid item xs={12}>
                    <Typography align="center">
                      {progress < 100
                        ? t('safetyPrograms.document.uploading', 'Uploading')
                        : t('safetyPrograms.document.finishing', 'Finishing')}
                      <br />
                      <span className={classes.fileName}>{newFileName || file.name}</span>
                    </Typography>
                    <LinearProgress
                      variant={progress < 100 ? 'determinate' : 'indeterminate'}
                      color="secondary"
                      value={progress}
                    />
                  </Grid>
                  {confirmingCancel ? (
                    <React.Fragment>
                      <Grid item xs={12}>
                        <Typography color="error" align="center">
                          {t(
                            'safetyPrograms.document.cancelUploadingConfirmation',
                            'Are you sure you want to cancel this upload?'
                          )}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Button onClick={this.resumeUpload}>
                          {t('safetyPrograms.document.noResume', 'No, Resume')}
                        </Button>
                      </Grid>
                      <Grid item>
                        <ErrorButton onClick={this.cancelUpload}>
                          {t('safetyPrograms.document.yesCancelIt', 'Yes, Cancel It')}
                        </ErrorButton>
                      </Grid>
                    </React.Fragment>
                  ) : (
                    <Grid item>
                      <Button onClick={this.confirmCancel} disabled={progress === 100}>
                        {t('safetyPrograms.common.cancel', 'Cancel')}
                      </Button>
                    </Grid>
                  )}
                </GridContainer>
              ) : errorKey === 'CONFLICT_ERROR' && suggestedFileName ? (
                <GridContainer justify="space-between">
                  <Grid item xs={12}>
                    <Typography color="error" align="center" paragraph>
                      <Trans i18nKey="safetyPrograms.document.fileAlreadyUploaded">
                        A file named <span className={classes.fileName}>{{ name: file.name }}</span> has already been
                        uploaded.
                      </Trans>
                    </Typography>
                    <Typography align="center" paragraph>
                      <Trans i18nKey="safetyPrograms.document.uploadFileAs">
                        Would you like to upload your file as{' '}
                        <span className={classes.fileName}>{{ suggestedFileName }}</span> instead?
                      </Trans>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button onClick={this.reset}>{t('safetyPrograms.document.noCancel', 'No, Cancel')}</Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={this.startRenamedUpload(suggestedFileName)} color="secondary" variant="contained">
                      {t('safetyPrograms.document.yesUploadIt', 'Yes, Upload It')}
                    </Button>
                  </Grid>
                </GridContainer>
              ) : (
                <GridContainer justify="space-between">
                  <Grid item xs={12}>
                    {error && (
                      <Typography color="error" align="center" paragraph>
                        {t(
                          'safetyPrograms.common.problemWithUploadingFile',
                          'There was a problem uploading your file. Please try again.'
                        )}
                      </Typography>
                    )}
                    <Typography
                      align="center"
                      style={{
                        marginBottom: 4 // Matches height of LinearProgress bar
                      }}
                    >
                      {t('safetyPrograms.document.readyToUpload', 'Ready to Upload')}
                      <br />
                      <span className={classes.fileName}>{newFileName || file.name}</span>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button onClick={this.reset}>{t('safetyPrograms.common.reset', 'Reset')}</Button>
                  </Grid>
                  <Grid item>
                    <Button onClick={this.startUpload} color="secondary" variant="contained">
                      {t('safetyPrograms.document.uploadPDF', 'Upload PDF')}
                    </Button>
                  </Grid>
                </GridContainer>
              )}
            </Grid>
          </GridContainer>
        ) : (
          <Dropzone accept=".pdf" maxSize={15e6} multiple={false} onDrop={this.handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div className={this.props.classes.upload} {...getRootProps()}>
                <GridContainer>
                  <input {...getInputProps()} />
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="secondary" paragraph>
                      {t('safetyPrograms.common.orUploadNewDocument', 'Or Upload a New Document')}
                    </Typography>
                    <GridContainer justify="center">
                      {error ? (
                        <Grid item xs={12}>
                          <Typography color="error" align="center">
                            {t(
                              'safetyPrograms.common.problemWithUploadingFile',
                              'There was a problem uploading your file. Please try again.'
                            )}
                          </Typography>
                        </Grid>
                      ) : (
                        invalidFile && (
                          <Grid item xs={12}>
                            <Typography style={{ color: amber[900] }} align="center">
                              {t('safetyPrograms.document.mbLimitWarning', 'Only a PDF under 15 MB will be accepted.')}
                            </Typography>
                          </Grid>
                        )
                      )}
                      <Grid item>
                        <PostAddIcon fontSize="large" color="action" />
                      </Grid>
                      <Grid item>
                        <Typography paragraph>
                          <Trans i18nKey="safetyPrograms.document.dragAndDropPdf">
                            Drag-and-drop a PDF here,
                            <br />
                            or click to select one.
                          </Trans>
                        </Typography>
                      </Grid>
                    </GridContainer>
                  </Grid>
                </GridContainer>
              </div>
            )}
          </Dropzone>
        )}
      </Paper>
    );
  }
}

export const AddDocumentComponent = withStyles(styles)(withTranslation()(Component));
