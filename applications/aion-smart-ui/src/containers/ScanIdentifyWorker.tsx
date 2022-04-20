import React from 'react';
import BarcodeScannerComponent from 'react-webcam-barcode-scanner';
import { RouteComponentProps } from 'react-router-dom';
import { Result } from '@zxing/library';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { BarcodeScanButton } from 'components/BarcodeScanButton';

type RouteParams = {
  organizationId: string;
  siteId: string;
};

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      flexGrow: 1
    }
  })
);

type Props = RouteComponentProps<RouteParams>;

const ScanIdentifyWorker: React.FC<Props> = ({
  history,
  match: {
    params: { organizationId, siteId }
  }
}) => {
  const redirect = (result: string) => {
    history.push(`/${organizationId}/sites/${siteId}/workerId/${result}`);
  };
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <BarcodeScanButton inCamera={true} organizationId={organizationId} siteId={siteId} />
      <Grid container direction="row" justify="center">
        <BarcodeScannerComponent
          width={375}
          height={375}
          onUpdate={(_err: unknown, result: Result) => {
            if (result) {
              redirect(result.getText());
            }
          }}
        />
      </Grid>
    </div>
  );
};

export const ScanIdentifyWorkerComponenet = ScanIdentifyWorker;
