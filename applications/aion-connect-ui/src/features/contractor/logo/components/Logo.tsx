import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import AvatarEditor, { Position } from 'react-avatar-editor';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import Dropzone, { FileWithPath } from 'react-dropzone';
import Grid from '@material-ui/core/Grid';
import InsertPhotoIcon from '@material-ui/icons/InsertPhoto';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ReactAvatarEditor from 'react-avatar-editor';
import RemoveIcon from '@material-ui/icons/Remove';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import Typography from '@material-ui/core/Typography';
import { AsyncDialog } from '@pec/aion-ui-components/components/AsyncDialog';
import { AxiosError } from 'axios';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { IconButton, Slider } from '@material-ui/core';
import { IUploadedLogo } from 'interfaces/uploadedLogo';
import { Loading } from '@pec/aion-ui-components/components/Loading';

const styles = (theme: Theme) =>
  createStyles({
    title: {
      padding: 0
    },
    dropzoneContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center'
    },
    avatarEditorContainer: {
      margin: theme.spacing(2),
      color: theme.palette.grey[300],
      border: `${theme.spacing(0.25)}px dashed ${theme.palette.grey[300]}`
    },
    logoContainer: {
      minHeight: 275,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: theme.palette.grey[300]
    },
    logoContainerForContractorUser: {
      border: `${theme.spacing(0.25)}px dashed ${theme.palette.grey[300]}`,
      cursor: 'pointer'
    },
    logoPhoto: {
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      border: 'none',
      borderRadius: theme.spacing(1)
    },
    photoText: {
      color: theme.palette.grey[300]
    },
    insertPhotoIcon: {
      fontSize: 72
    },
    logoHover: {
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
    noLogo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    editOptionsContainer: {
      paddingTop: theme.spacing(1),
      flexDirection: 'row'
    },
    editOptionsItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    zoomOutIcon: {
      color: theme.palette.grey[600],
      margin: theme.spacing()
    },
    zoomInIcon: {
      color: theme.palette.grey[600],
      fontSize: 28,
      margin: theme.spacing()
    },
    rotateButton: {
      background: theme.palette.grey[300]
    }
  });

type State = {
  image?: File;
  name: string;
  position: Position;
  rotate: number;
  scale: number;
  style: React.CSSProperties;
};

type OwnProps = {
  addLogo: (blob: Blob | null, name: string) => Promise<Blob>;
  logo?: Blob | null;
  metaData?: DeepReadonly<IUploadedLogo> | null;
  error: DeepReadonly<AxiosError> | null;
  isFetching: boolean;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

export class Logo extends React.Component<Props, State> {
  editor: AvatarEditor | null;

  defaultState = {
    name: 'logo.png',
    position: { x: 0.5, y: 0.5 },
    rotate: 0,
    scale: 1,
    style: {}
  };

  constructor(props: Props) {
    super(props);
    this.editor = null;

    if (props.logo && props.metaData) {
      this.state = {
        ...this.defaultState,
        name: props.metaData.fileName,
        image: new File([props.logo], 'logo'),
        style: this.backgroundImageStyle(props.logo)
      };
    } else {
      this.state = this.defaultState;
    }
  }

  backgroundImageStyle(logo: Blob) {
    return {
      backgroundImage: `url(${URL.createObjectURL(logo)})`
    };
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise<string | ArrayBuffer | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  async componentDidUpdate({ logo: prevLogo }: Props) {
    const { logo, metaData } = this.props;
    const base64PrevLogo = prevLogo && (await this.convertBlobToBase64(prevLogo));
    const base64Logo = logo && (await this.convertBlobToBase64(logo));

    if (base64PrevLogo !== base64Logo && logo && metaData) {
      this.setState({
        ...this.defaultState,
        name: metaData.fileName,
        image: base64Logo as any,
        style: this.backgroundImageStyle(logo)
      });
    }
  }

  reset = () => {
    const { metaData, logo } = this.props;

    this.setState({
      ...this.defaultState,
      name: metaData ? metaData.fileName : this.defaultState.name,
      image: logo && metaData ? new File([logo], metaData.fileName) : undefined,
      style: logo ? this.backgroundImageStyle(logo) : this.defaultState.style
    });
  };

  setEditorRef = (editor: AvatarEditor) => {
    if (editor) {
      this.editor = editor;
    }
  };

  renderTriggerButtonForUpload = (handleToggle: () => void) => {
    const { classes, logo, viewAsClient } = this.props;

    return (
      <HasPermissionContainer>
        {({ hasOrganizationAssetPermission }) => (
          <Grid
            item
            xs={12}
            md={2}
            className={classNames(
              classes.logoContainer,
              logo && classes.logoPhoto,
              !viewAsClient && classes.logoContainerForContractorUser
            )}
            onClick={hasOrganizationAssetPermission() && !viewAsClient ? handleToggle : undefined}
            style={this.state.style}
          >
            <div className={logo && !viewAsClient ? classes.logoHover : classes.noLogo}>
              {!viewAsClient && (
                <React.Fragment>
                  <InsertPhotoIcon className={classes.insertPhotoIcon} />
                  <Typography variant="h6" className={classes.photoText}>
                    {logo ? 'Edit Logo' : 'Add Logo'}
                  </Typography>
                </React.Fragment>
              )}
            </div>
          </Grid>
        )}
      </HasPermissionContainer>
    );
  };

  handleSave = () =>
    new Promise<void>((resolve, reject) => {
      if (this.editor) {
        const canvas = this.editor.getImage();
        const context = canvas.getContext('2d');

        if (context) {
          context.globalCompositeOperation = 'destination-over';
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        canvas.toBlob(async blob => {
          try {
            await this.props.addLogo(blob, this.state.name);
            resolve();
          } catch (error) {
            reject(error);
          }
        }, this.state.image?.type);
      } else {
        reject();
      }
    });

  handleScale = (_event: React.SyntheticEvent<HTMLInputElement>, scale: number) => this.setState({ scale });

  rotateRight = (event: React.SyntheticEvent<HTMLElement>) => {
    event.preventDefault();

    this.setState({
      rotate: this.state.rotate + 90
    });
  };

  handlePositionChange = (position: Position) => this.setState({ position });

  handleDrop = (acceptedFiles: FileWithPath[]) => {
    if (acceptedFiles.length) {
      this.setState({ image: acceptedFiles[0], name: acceptedFiles[0].name });
    }
  };

  render() {
    const { logo, error, isFetching, classes, viewAsClient } = this.props;
    const { image } = this.state;
    const acceptedFileTypes = ['.jpeg', '.jpg', '.png'];

    return (
      <AsyncDialog
        renderTriggerButton={(!viewAsClient && !logo) || logo ? this.renderTriggerButtonForUpload : undefined}
        fullWidth
        maxWidth="sm"
        onExited={this.reset}
        asyncAction={this.handleSave}
        submitButtonColor={image ? 'secondary' : 'primary'}
        submitButtonText="Save"
      >
        {!isFetching && !error ? (
          <React.Fragment>
            <Grid container>
              <Grid item xs={12}>
                <MuiDialogTitle className={classes.title}>{logo ? 'Edit Logo' : 'Add Logo'}</MuiDialogTitle>
              </Grid>
            </Grid>
            <Grid container className={classes.dropzoneContainer}>
              <Grid item xs={12}>
                <Dropzone accept={acceptedFileTypes} onDrop={this.handleDrop} multiple={false} noClick>
                  {({ getRootProps, getInputProps, open }) => (
                    <React.Fragment>
                      <div {...getRootProps()}>
                        <ReactAvatarEditor
                          ref={this.setEditorRef}
                          scale={this.state.scale}
                          width={400}
                          height={400}
                          border={0}
                          position={this.state.position}
                          onPositionChange={this.handlePositionChange}
                          rotate={this.state.rotate}
                          image={this.state.image || ''}
                          className={classes.avatarEditorContainer}
                        />
                        <input {...getInputProps()} />
                      </div>
                      <Button variant="contained" color="primary" onClick={open}>
                        {image ? 'Change Logo' : 'Find Logo'}
                      </Button>
                    </React.Fragment>
                  )}
                </Dropzone>
              </Grid>
            </Grid>
            {image && (
              <Grid container justify="center" alignItems="center" className={classes.editOptionsContainer}>
                <Grid item xs={5} className={classes.editOptionsItem}>
                  <RemoveIcon className={classes.zoomOutIcon} />
                  <Slider name="scale" onChange={this.handleScale} min={0.1} max={2} step={0.01} defaultValue={1} />
                  <AddIcon className={classes.zoomInIcon} />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={this.rotateRight} className={classes.rotateButton}>
                    <RotateRightIcon />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </React.Fragment>
        ) : error ? (
          <Error />
        ) : (
          <Loading />
        )}
      </AsyncDialog>
    );
  }
}

export const LogoComponent = withStyles(styles)(Logo);
