import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import classNames from 'classnames';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Toolbar from '@material-ui/core/Toolbar';
import { AxiosError } from 'axios';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Dialog, TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Loading } from '@pec/aion-ui-components/components/Loading';

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.grey[700]
    },
    toolbar: theme.mixins.toolbar,
    imageGalleryArrows: {
      position: 'absolute',
      zIndex: 1
    },
    imageGalleryIcon: {
      fontSize: 100
    },
    root: {
      height: 'calc(100% - 64px)',
      display: 'flex',
      alignItems: 'center'
    }
  });

type OwnProps = {
  isFetchingImages: boolean;
  imagesError: DeepReadonly<AxiosError> | Error | null;
  fetchPhotoGalleryImagesIfNeeded: () => void;
  renderTriggerButton: (props: TriggerButtonProps) => JSX.Element;
  imageGallery: ReactImageGalleryItem[];
  index: number;
};

type Props = OwnProps & WithStyles<typeof styles>;

class FullScreenPhotoGallery extends React.Component<Props> {
  renderLeftNav = (onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void, isDisabled: boolean) => (
    <IconButton
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(this.props.classes.imageGalleryArrows, 'image-gallery-left-nav')}
    >
      <KeyboardArrowLeft className={this.props.classes.imageGalleryIcon} />
    </IconButton>
  );

  renderRightNav = (onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void, isDisabled: boolean) => (
    <IconButton
      disabled={isDisabled}
      onClick={onClick}
      className={classNames(this.props.classes.imageGalleryArrows, 'image-gallery-right-nav')}
    >
      <KeyboardArrowRight className={this.props.classes.imageGalleryIcon} />
    </IconButton>
  );

  render() {
    const {
      classes,
      renderTriggerButton,
      index,
      fetchPhotoGalleryImagesIfNeeded,
      isFetchingImages,
      imageGallery,
      imagesError
    } = this.props;

    return (
      <Dialog renderTriggerButton={renderTriggerButton} fullScreen onEntered={fetchPhotoGalleryImagesIfNeeded}>
        {({ handleClose }) => (
          <React.Fragment>
            <AppBar classes={{ colorPrimary: classes.appBar }}>
              <Toolbar style={{ justifyContent: 'flex-end' }}>
                <IconButton color="inherit" onClick={handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            <div className={classes.toolbar} />
            <Grid container justify="center" alignItems="center" className={classes.root}>
              <Grid item xs={12}>
                {!isFetchingImages && !imagesError && imageGallery.length ? (
                  <ImageGallery
                    items={imageGallery}
                    startIndex={index}
                    showThumbnails={false}
                    showPlayButton={false}
                    showFullscreenButton={false}
                    renderLeftNav={this.renderLeftNav}
                    renderRightNav={this.renderRightNav}
                  />
                ) : imagesError ? (
                  <Error />
                ) : (
                  <Loading />
                )}
              </Grid>
            </Grid>
          </React.Fragment>
        )}
      </Dialog>
    );
  }
}

export const FullScreenPhotoGalleryComponent = withStyles(styles)(FullScreenPhotoGallery);
