import Grid from '@material-ui/core/Grid';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { CircularProgress } from '@material-ui/core';
import { Error } from '@pec/aion-ui-components/components/Error';
import { localizeUTCDate } from 'helpers/dates';
import { useTranslation } from 'react-i18next';
import { useTypedSelector } from 'app/reducer';

export const VerificationHeader: React.FC = () => {
  const { t } = useTranslation();

  const { import: oshaImport, isFetching: importIsFetching, error: importError } = useTypedSelector(
    state => state.oshaImport
  );

  return (
    <Grid style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom>
        {t('oshaViolations.verificationHeader.oshaViolationVerification', 'OSHA Violation Verification')}
      </Typography>
      {importError ? (
        <Error />
      ) : importIsFetching ? (
        <CircularProgress size={30} />
      ) : (
        <Typography variant="body2">
          {t('oshaViolations.verificationHeader.dataPulled', {
            defaultValue: 'Data Pulled From OSHA {{time}}',
            time: oshaImport && localizeUTCDate(oshaImport[0].runDateTimeUtc, t)
          })}
        </Typography>
      )}
    </Grid>
  );
};
