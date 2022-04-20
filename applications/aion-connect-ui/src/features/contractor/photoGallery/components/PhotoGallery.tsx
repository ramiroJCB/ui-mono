import * as React from 'react';
import CameraIcon from '@material-ui/icons/CameraAlt';
import classNames from 'classnames';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ErrorIcon from '@material-ui/icons/Error';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import LinearProgress from '@material-ui/core/LinearProgress';
import ReplayIcon from '@material-ui/icons/Replay';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FileWithPath } from 'react-dropzone';
import { FullScreenPhotoGalleryContainer } from '../containers/FullScreenPhotoGallery';
import { IImage, RejectedImageFailure } from 'interfaces/image';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { PhotoUpload } from './PhotoUpload';

const styles = (theme: Theme) =>
  createStyles({
    photoGalleryContainer: {
      minHeight: 275,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.palette.grey[300],
      border: `${theme.spacing(0.25)}px dashed ${theme.palette.grey[300]}`,
      cursor: 'pointer'
    },
    photoText: {
      color: theme.palette.grey[300]
    },
    icon: {
      color: 'white'
    },
    cameraIcon: {
      fontSize: 72
    },
    gridList: {
      width: '100%'
    },
    titleWrap: {
      margin: 0
    },
    actionIcon: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    },
    gridListTile: {
      borderRadius: theme.spacing(0.5)
    },
    imageFullHeight: {
      left: '50%',
      height: '100%',
      position: 'relative',
      transform: 'translateX(-50%)',
      cursor: 'pointer'
    },
    imageError: {
      filter: 'grayscale(100%)',
      cursor: 'initial'
    },
    progressContainer: {
      flexGrow: 1,
      padding: '0 8px'
    },
    progressBar: {
      backgroundColor: 'rgb(255, 255, 255)'
    },
    coverPhoto: {
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      border: 'none',
      borderRadius: theme.spacing(1)
    },
    coverPhotoHover: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      opacity: 0,
      '&:hover': {
        borderRadius: theme.spacing(1),
        background: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))',
        opacity: 1,
        transition: 'opacity .25s ease-in-out .0s'
      }
    },
    noCoverPhoto: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }
  });

type OwnProps = {
  metaData: DeepReadonly<IUploadedImage[]>;
  coverPhoto?: DeepReadonly<IImage>;
  fetchPhotoGalleryThumbnailsIfNeeded: () => Promise<IImage[]>;
  isFetchingThumbnails: boolean;
  imagesError: DeepReadonly<AxiosError> | Error | null;
  addPhotoGalleryImage: (image: IImage) => Promise<IImage>;
  deleteImage: (image: DeepReadonly<IImage>) => () => Promise<void>;
  setCoverPhoto: (image: DeepReadonly<IImage>) => () => Promise<void>;
  processImages: (acceptedFiles: FileWithPath[]) => Promise<IImage[]>;
  acceptedImages: DeepReadonly<IImage[]>;
  rejectedImages: DeepReadonly<IImage[]>;
  limitExceeded: boolean;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

class PhotoGallery extends React.Component<Props> {
  handleOnDrop = (acceptedFiles: FileWithPath[], _rejectedFiles: FileWithPath[]) =>
    this.props.processImages(acceptedFiles);

  renderTriggerButtonForUpload = (props: TriggerButtonProps) => {
    const { classes, coverPhoto, viewAsClient } = this.props;

    return (
      <Grid
        item
        xs={12}
        md={2}
        className={classNames(classes.photoGalleryContainer, coverPhoto && classes.coverPhoto)}
        style={
          coverPhoto && {
            backgroundImage: `url(${URL.createObjectURL(coverPhoto.thumbnail)})`
          }
        }
        {...props}
      >
        <div className={coverPhoto ? classes.coverPhotoHover : classes.noCoverPhoto}>
          <CameraIcon className={classes.cameraIcon} />
          <Typography variant="h6" className={classes.photoText}>
            {viewAsClient ? 'View Photos' : 'Add Photos'}
          </Typography>
        </div>
      </Grid>
    );
  };

  renderActionIcon = (image: DeepReadonly<IImage>) => {
    const { classes, deleteImage, setCoverPhoto } = this.props;

    return image.metaData && !image.isLoading && !image.error ? (
      <React.Fragment>
        <Tooltip title="Set as Cover" placement="top">
          <IconButton className={classes.icon} onClick={setCoverPhoto(image)}>
            {image.isCoverPhoto ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete Photo" placement="top">
          <IconButton className={classes.icon} onClick={deleteImage(image)}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    ) : !image.metaData && image.uploadProgress && !image.error ? (
      <div className={classes.progressContainer}>
        <LinearProgress
          variant="determinate"
          classes={{ barColorPrimary: classes.progressBar }}
          value={image.uploadProgress}
        />
      </div>
    ) : image.error === RejectedImageFailure.FileSize ? (
      <React.Fragment>
        <Tooltip title={image.error} placement="top">
          <ErrorIcon color="error" />
        </Tooltip>
        <Tooltip title="Delete Photo" placement="top">
          <IconButton className={classes.icon} onClick={deleteImage(image)}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    ) : image.error === RejectedImageFailure.NetworkError && !image.isLoading ? (
      <React.Fragment>
        <Tooltip title="Network error" placement="top">
          <IconButton>
            <ErrorIcon color="error" />
          </IconButton>
        </Tooltip>
        {image.metaData && (
          <Tooltip title="Set as Cover" placement="top">
            <IconButton className={classes.icon} onClick={setCoverPhoto(image)}>
              {image.isCoverPhoto ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
        )}
        {!image.metaData && (
          <Tooltip title="Retry" placement="top">
            <IconButton
              className={classes.icon}
              onClick={() => this.props.addPhotoGalleryImage({ ...image, retryUpload: true } as IImage)}
            >
              <ReplayIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete Photo" placement="top">
          <IconButton className={classes.icon} onClick={deleteImage(image)}>
            <DeleteOutlineIcon />
          </IconButton>
        </Tooltip>
      </React.Fragment>
    ) : image.isLoading ? (
      <div className={classes.progressContainer}>
        <LinearProgress classes={{ barColorPrimary: classes.progressBar }} />
      </div>
    ) : null;
  };

  renderTriggerButtonForImage = (image: DeepReadonly<IImage>) => (props: TriggerButtonProps) => {
    const { classes, viewAsClient } = this.props;

    return (
      <React.Fragment>
        <img
          className={classes.imageFullHeight}
          src={URL.createObjectURL(image.thumbnail)}
          alt={image.fileName}
          {...props}
        />
        {!viewAsClient && (
          <GridListTileBar
            classes={{ titleWrap: classes.titleWrap, actionIcon: classes.actionIcon }}
            actionIcon={this.renderActionIcon(image)}
          />
        )}
      </React.Fragment>
    );
  };

  render() {
    const {
      classes,
      acceptedImages,
      rejectedImages,
      limitExceeded,
      isFetchingThumbnails,
      imagesError,
      fetchPhotoGalleryThumbnailsIfNeeded,
      viewAsClient,
      metaData
    } = this.props;

    return (
      <Dialog
        renderTriggerButton={
          (!viewAsClient && !metaData.length) || metaData.length ? this.renderTriggerButtonForUpload : undefined
        }
        fullWidth
        maxWidth="md"
        onEntering={fetchPhotoGalleryThumbnailsIfNeeded}
      >
        {() => (
          <React.Fragment>
            <DialogTitle>Photo Gallery</DialogTitle>
            <DialogContent>
              {!isFetchingThumbnails && !imagesError ? (
                <React.Fragment>
                  {!viewAsClient && (
                    <PhotoUpload
                      handleOnDrop={this.handleOnDrop}
                      error={limitExceeded ? 'Image Limit Exceeded' : undefined}
                    />
                  )}
                  {(acceptedImages.length > 0 || rejectedImages.length > 0) && (
                    <GridList cols={5} cellHeight={150} className={classes.gridList}>
                      {acceptedImages.map((image, index) => (
                        <GridListTile key={image.id} classes={{ tile: classes.gridListTile }}>
                          <FullScreenPhotoGalleryContainer
                            renderTriggerButton={this.renderTriggerButtonForImage(image)}
                            index={index}
                          />
                        </GridListTile>
                      ))}

                      {rejectedImages.map(image => (
                        <GridListTile key={image.id} classes={{ tile: classes.gridListTile }}>
                          <React.Fragment>
                            <img
                              className={classNames(classes.imageFullHeight, classes.imageError)}
                              src={URL.createObjectURL(image.thumbnail)}
                              alt={image.fileName}
                            />
                            <GridListTileBar
                              classes={{ titleWrap: classes.titleWrap, actionIcon: classes.actionIcon }}
                              actionIcon={this.renderActionIcon(image)}
                            />
                          </React.Fragment>
                        </GridListTile>
                      ))}
                    </GridList>
                  )}
                </React.Fragment>
              ) : imagesError ? (
                <Error />
              ) : (
                <Loading />
              )}
            </DialogContent>
          </React.Fragment>
        )}
      </Dialog>
    );
  }
}

export const PhotoGalleryComponent = withStyles(styles)(PhotoGallery);
