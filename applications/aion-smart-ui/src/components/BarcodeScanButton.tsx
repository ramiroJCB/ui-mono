import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import CameraIcon from '@material-ui/icons/CameraAlt';
import CloseIcon from '@material-ui/icons/Close';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  siteId: string;
  isFetching?: boolean;
  inCamera: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      textAlign: 'center'
    },
    link: {
      textDecoration: 'none'
    },
    button: {
      color: theme.palette.primary.main,
      fontSize: 15
    },
    inCamera: {
      width: 375
    },
    cameraIcon: {
      marginRight: 10
    }
  })
);

export const BarcodeScanButton: React.FC<Props> = ({ organizationId, siteId, inCamera, isFetching }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <div className={classes.root}>
      {inCamera ? (
        <Link to={`/${organizationId}/sites/${siteId}`} className={classes.link} role="button">
          <Button className={`${classes.button} ${classes.inCamera}`}>
            <CloseIcon className={classes.cameraIcon} />
          </Button>
        </Link>
      ) : isFetching ? (
        <Button disabled={true} fullWidth={true} className={classes.button}>
          <CameraIcon className={classes.cameraIcon} /> {t('smart.barcodeScan.scanPECID', 'SCAN PEC ID')}
        </Button>
      ) : (
        <Link to={`/${organizationId}/sites/${siteId}/scanBarCode`} className={classes.link} role="button">
          <Button fullWidth={true} className={classes.button}>
            <CameraIcon className={classes.cameraIcon} /> {t('smart.barcodeScan.scanPECID', 'SCAN PEC ID')}
          </Button>
        </Link>
      )}
    </div>
  );
};
