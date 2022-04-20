import * as React from 'react';
import { addPhotoGalleryImage, processImages } from '../actions/addPhotoGalleryImage';
import { connect } from 'react-redux';
import { DeepReadonly } from 'utility-types';
import { deleteImage } from '../actions/deletePhotoGalleryImage';
import { fetchPhotoGalleryThumbnailsIfNeeded } from '../actions/fetchPhotoGalleryThumbnails';
import { FileWithPath } from 'react-dropzone';
import { IImage } from 'interfaces/image';
import { PhotoGalleryComponent } from '../components/PhotoGallery';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { setCoverPhoto } from '../coverPhoto/actions/setCoverPhoto';
import { ThunkDispatch } from 'redux-thunk';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

const mapStateToProps = (state: RootState) => {
  const { isFetchingThumbnails, imagesError, acceptedImages, rejectedImages, limitExceeded } = state.photoGallery;
  const { coverPhoto } = state.photoGalleryCoverPhoto;
  const { metaData } = state.photoGalleryMetaData;
  const { viewAsClient } = state.profile;

  return {
    metaData,
    isFetchingThumbnails,
    imagesError,
    acceptedImages,
    rejectedImages,
    limitExceeded,
    coverPhoto,
    viewAsClient
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { organizationId, contractorId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  fetchPhotoGalleryThumbnailsIfNeeded: () =>
    dispatch(fetchPhotoGalleryThumbnailsIfNeeded(organizationId, contractorId)),
  addPhotoGalleryImage: (image: IImage) => dispatch(addPhotoGalleryImage(organizationId, image)),
  deleteImage: (image: DeepReadonly<IImage>) => () => dispatch(deleteImage(organizationId, image)),
  setCoverPhoto: (image: DeepReadonly<IImage>) => () => dispatch(setCoverPhoto(organizationId, image)),
  processImages: (acceptedFiles: FileWithPath[]) => dispatch(processImages(organizationId, acceptedFiles))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams>;

class PhotoGallery extends React.Component<Props> {
  render() {
    const {
      metaData,
      isFetchingThumbnails,
      imagesError,
      addPhotoGalleryImage,
      deleteImage,
      setCoverPhoto,
      processImages,
      acceptedImages,
      rejectedImages,
      limitExceeded,
      fetchPhotoGalleryThumbnailsIfNeeded,
      coverPhoto,
      viewAsClient
    } = this.props;

    return (
      <PhotoGalleryComponent
        metaData={metaData}
        coverPhoto={coverPhoto}
        fetchPhotoGalleryThumbnailsIfNeeded={fetchPhotoGalleryThumbnailsIfNeeded}
        isFetchingThumbnails={isFetchingThumbnails}
        imagesError={imagesError}
        addPhotoGalleryImage={addPhotoGalleryImage}
        deleteImage={deleteImage}
        setCoverPhoto={setCoverPhoto}
        processImages={processImages}
        acceptedImages={acceptedImages}
        rejectedImages={rejectedImages}
        limitExceeded={limitExceeded}
        viewAsClient={viewAsClient}
      />
    );
  }
}

export const PhotoGalleryContainer = withRouter(connect(mapStateToProps, mapDispatchToProps)(PhotoGallery));
