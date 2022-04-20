import CameraIcon from '@material-ui/icons/CameraAlt';
import Dropzone, { DropEvent, FileWithPath } from 'react-dropzone';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';

export const defaultAllowedFileExtensions = ['.jpeg', '.jpg', '.png'];

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: '24px'
    },
    dropzone: {
      border: `${theme.spacing(0.25)}px dashed ${theme.palette.grey[300]}`,
      backgroundColor: theme.palette.common.white,
      cursor: 'pointer'
    },
    dropzoneError: {
      border: `${theme.spacing(0.25)}px dashed ${theme.palette.error.main}`,
      backgroundColor: theme.palette.common.white
    },
    photoGalleryContainer: {
      minHeight: '175px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.palette.grey[300]
    },
    text: {
      color: theme.palette.grey[300]
    },
    error: {
      color: theme.palette.error.main
    }
  });

type OwnProps = {
  handleOnDrop: (acceptedFiles: FileWithPath[], rejectedFiles: FileWithPath[], event: DropEvent) => void;
  error?: string;
  allowedFileExtensions?: string[];
};

type Props = OwnProps & WithStyles<typeof styles>;

const PhotoUploadComponent: React.FC<Props> = ({ allowedFileExtensions, classes, handleOnDrop, error }) => (
  <div className={classes.root}>
    <Dropzone accept={allowedFileExtensions || defaultAllowedFileExtensions} noClick noKeyboard onDrop={handleOnDrop}>
      {({ getRootProps, getInputProps, open }) => (
        <div {...getRootProps({ className: 'dropzone' })}>
          <GridContainer
            justify="center"
            className={error ? classes.dropzoneError : classes.dropzone}
            onClick={!error ? open : () => null}
          >
            <Grid item className={classes.photoGalleryContainer}>
              <input {...getInputProps()} />
              <CameraIcon style={{ fontSize: '72px' }} className={error ? classes.error : classes.text} />
              {!error && (
                <Typography variant="h6" className={error ? classes.error : classes.text}>
                  Upload 10 Photos
                </Typography>
              )}
              {error && (
                <Typography variant="h6" color="error">
                  {error}
                </Typography>
              )}
            </Grid>
          </GridContainer>
        </div>
      )}
    </Dropzone>
  </div>
);

export const PhotoUpload = withStyles(styles)(PhotoUploadComponent);
