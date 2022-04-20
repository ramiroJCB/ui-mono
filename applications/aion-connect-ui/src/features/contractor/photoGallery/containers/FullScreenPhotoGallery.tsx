import * as React from 'react';
import { connect } from 'react-redux';
import { fetchPhotoGalleryImagesIfNeeded } from '../actions/fetchPhotoGalleryImages';
import { FullScreenPhotoGalleryComponent } from '../components/FullScreenPhotoGallery';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { TriggerButtonProps } from '@pec/aion-ui-components/components/Dialog';

type RouteParams = {
  organizationId: string;
  contractorId?: string;
};

type OwnProps = {
  renderTriggerButton: (props: TriggerButtonProps) => JSX.Element;
  index: number;
};

const mapStateToProps = (state: RootState) => {
  const { acceptedImages } = state.photoGallery;

  return {
    ...state.photoGallery,
    imageGallery: acceptedImages.every(image => image.fullSize)
      ? acceptedImages.map(image => ({
          original: URL.createObjectURL(image.fullSize)
        }))
      : []
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
  fetchPhotoGalleryImagesIfNeeded: () => dispatch(fetchPhotoGalleryImagesIfNeeded(organizationId, contractorId))
});

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  RouteComponentProps<RouteParams> &
  OwnProps;

class FullScreenPhotoGallery extends React.Component<Props> {
  render() {
    const {
      isFetchingImages,
      imagesError,
      fetchPhotoGalleryImagesIfNeeded,
      imageGallery,
      renderTriggerButton,
      index
    } = this.props;

    return (
      <FullScreenPhotoGalleryComponent
        isFetchingImages={isFetchingImages}
        imagesError={imagesError}
        fetchPhotoGalleryImagesIfNeeded={fetchPhotoGalleryImagesIfNeeded}
        imageGallery={imageGallery}
        renderTriggerButton={renderTriggerButton}
        index={index}
      />
    );
  }
}

export const FullScreenPhotoGalleryContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FullScreenPhotoGallery)
);
