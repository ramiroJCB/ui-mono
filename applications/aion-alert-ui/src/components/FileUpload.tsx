import Button from '@material-ui/core/Button';
import Dropzone, { FileWithPath } from 'react-dropzone';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';

const maxFileSize = 15728640; // 15MB
const allowedFileExtensions = ['.jpg', '.jpeg', '.pdf', '.png', '.doc', '.docx', '.xls', '.xlsx'];

const styles = (theme: Theme) =>
  createStyles({
    dropzone: {
      border: `${theme.spacing(0.25)}px dashed ${theme.palette.grey[300]}`,
      backgroundColor: theme.palette.grey[50]
    }
  });

type OwnProps = {
  onFilesSelected: (acceptedFiles: FileWithPath[], rejectedFiles: InvalidFileUpload[]) => void;
};

type Props = OwnProps & WithStyles<typeof styles>;

class FileUploadComponent extends React.Component<Props> {
  handleOnDrop = (acceptedFiles: FileWithPath[], rejectedFiles: FileWithPath[]) => {
    const { onFilesSelected } = this.props;

    const invalidFiles = rejectedFiles.map(file => ({
      name: file.name || 'Unknown',
      reason: file.size > maxFileSize ? 'File is too big' : 'Unsupported file type'
    }));

    onFilesSelected(acceptedFiles, invalidFiles);
  };

  render() {
    const { classes } = this.props;
    return (
      <Dropzone maxSize={maxFileSize} accept={allowedFileExtensions} noClick noKeyboard onDrop={this.handleOnDrop}>
        {({ getRootProps, getInputProps, open }) => (
          <div {...getRootProps({ className: 'dropzone' })}>
            <GridContainer justify="center" className={classes.dropzone}>
              <Grid item>
                <input {...getInputProps()} />
                <Typography variant="h6" align="center">
                  Drag and Drop Files Here
                </Typography>
                <Typography variant="subtitle2" align="center">
                  Accepted files: .doc, .docx, .jpeg, .jpg, .pdf, .png, .xls and .xlsx
                </Typography>
                <Typography variant="subtitle2" align="center">
                  Max size: 15MB
                </Typography>
                <Typography display="block" variant="overline" align="center">
                  Or
                </Typography>
                <GridContainer justify="center" spacing={0}>
                  <Grid item>
                    <Button variant="contained" color="secondary" onClick={open}>
                      Browse Files
                    </Button>
                  </Grid>
                </GridContainer>
              </Grid>
            </GridContainer>
          </div>
        )}
      </Dropzone>
    );
  }
}

export const FileUpload = withStyles(styles)(FileUploadComponent);
