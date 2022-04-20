import React, { useState, useEffect } from 'react';
import Barcode from 'react-barcode';
import GetAppIcon from '@material-ui/icons/GetApp';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { ITrainee } from '@pec/aion-ui-core/interfaces/trainee';
import { ITraineeCourseCredit } from 'interfaces/traineeCourseCredit';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { ScreenSize } from '@pec/aion-ui-components/types/screenSize';
import { TabLink } from '@pec/aion-ui-components/components/TabLink';
import { useScreenSize } from '@pec/aion-ui-components/hooks/useScreenSize';
import { useTranslation } from 'react-i18next';
import { UserDocument } from './UserDocument';
import { saveAs } from 'file-saver';
import { pdf } from '@react-pdf/renderer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabLink: ({ smallDown }: ScreenSize) => ({
      padding: theme.spacing(2, 8),
      color: theme.palette.grey[600],
      textDecoration: 'none',
      [smallDown]: {
        flexGrow: 1,
        textAlign: 'center',
        padding: theme.spacing(1, 2)
      }
    }),
    button: ({ smallDown }: ScreenSize) => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingTop: theme.spacing(2),
      [smallDown]: {
        display: 'block'
      }
    })
  })
);

type Props = {
  trainee: DeepReadonly<ITrainee>;
  traineeCourseCredits: DeepReadonly<ITraineeCourseCredit[]>;
};

export const Tabs: React.FC<Props> = ({ trainee, traineeCourseCredits }) => {
  const { t, i18n } = useTranslation();
  const { smallDown } = useScreenSize();
  const classes = useStyles({ smallDown });
  const [barcode, setBarcode] = useState<string>();
  const [ready, setReady] = useState(false);
  const { firstName, lastName, pecIdentifier } = trainee;

  useEffect(() => {
    setTimeout(() => setReady((ready: boolean) => !ready));
    return () => setReady((ready: boolean) => !ready);
  }, [t, i18n]);

  const onRefChange = React.useCallback(node => {
    setBarcode(node?.refs?.renderElement?.src);
  }, []);

  const generatePDF = async () => {
    const blob = await pdf(
      <UserDocument trainee={trainee} traineeCourseCredits={traineeCourseCredits} barcode={barcode} />
    ).toBlob();
    saveAs(blob, `${firstName}_${lastName}.pdf`);
  };

  return (
    <Grid container justify="space-between">
      <Grid item xs={12} md={10}>
        <Toolbar disableGutters>
          <TabLink label={t('user.profile.trainingHistory', 'Training History')} to="/" className={classes.tabLink} />
          <TabLink
            label={t('user.profile.contactInfo', 'Contact Info')}
            to="/contact-info"
            className={classes.tabLink}
          />
        </Toolbar>
      </Grid>
      <Grid item xs={12} md={2} className={classes.button}>
        <div style={{ display: 'none' }}>
          <Barcode
            ref={onRefChange}
            value={pecIdentifier}
            format="CODE128"
            fontOptions="bold"
            renderer="img"
            displayValue={false}
          />
        </div>
        {barcode && ready && (
          <LoadingButton
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={generatePDF}
            startIcon={<GetAppIcon />}
          >
            {t('user.profile.downloadProfile', 'Download Profile')}
          </LoadingButton>
        )}
      </Grid>
    </Grid>
  );
};
