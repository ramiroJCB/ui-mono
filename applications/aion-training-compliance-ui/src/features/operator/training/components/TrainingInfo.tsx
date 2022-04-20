import * as React from 'react';
import BookIcon from '@material-ui/icons/Book';
import Grid from '@material-ui/core/Grid';
import TurnedInIcon from '@material-ui/icons/TurnedIn';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { ExpirationUnits, ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { Typography } from '@material-ui/core';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { formatCompliancePercentage } from 'helpers/formatCompliancePercentage';
import { getTrainingExpirationDuration } from 'helpers/trainingExpiration';
import { withTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { unitTypes } from '@pec/aion-ui-i18next/constants';
import { UnitType } from '@pec/aion-ui-i18next/types';

const styles = (theme: Theme) =>
  createStyles({
    gridItem: {
      display: 'flex'
    },
    label: {
      fontWeight: 'bold'
    },
    icon: {
      marginRight: 10
    },
    data: {
      paddingLeft: theme.spacing(1)
    },
    toolbar: {
      paddingLeft: 0
    }
  });

type OwnProps = {
  trainingRequirement: ITrainingRequirement;
  compliancePercentage?: number;
  compliancePercentageLabel?: string;
  subHeader?: JSX.Element;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

class TrainingInfo extends React.Component<Props> {
  formatExpiration = (expirationUnits: ExpirationUnits, expirationMillis: number) => {
    const { t } = this.props;
    const { day, month, week, year } = unitTypes;
    const count = getTrainingExpirationDuration(expirationMillis, expirationUnits);
    let unit: UnitType;

    switch (expirationUnits) {
      case ExpirationUnits.Years:
        unit = year;
        break;
      case ExpirationUnits.Months:
        unit = month;
        break;
      case ExpirationUnits.Weeks:
        unit = week;
        break;
      case ExpirationUnits.Days:
        unit = day;
        break;
      default:
        return undefined;
    }

    return localizeNumber(
      {
        value: count,
        config: {
          unit
        }
      },
      t
    );
  };

  render() {
    const { trainingRequirement, compliancePercentage, compliancePercentageLabel, classes, subHeader, t } = this.props;
    const {
      name,
      expirationUnits,
      expirationMillis,
      description,
      uploadRequired,
      organizationId,
      oshaReferenceNumbers
    } = trainingRequirement;

    return (
      <GridContainer>
        <Grid item xs={12} className={classes.gridItem}>
          {organizationId ? <BookIcon className={classes.icon} /> : <TurnedInIcon className={classes.icon} />}
          <Typography variant="body1" color="textSecondary">
            {organizationId
              ? t('trainingCompliance.common.customTraining', 'Custom Training')
              : t('trainingCompliance.common.standardTraining', 'Standard Training')}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="h5" className={classes.label}>
            {name}
            {subHeader}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{description}</Typography>
        </Grid>
        {!organizationId && oshaReferenceNumbers && (
          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="body1" className={classes.label}>
              {t('trainingCompliance.operator.training.OSHAReferences', 'OSHA References:')}
            </Typography>
            <Typography variant="body1" className={classes.data}>
              {oshaReferenceNumbers}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="body1" className={classes.label}>
            {t('trainingCompliance.operator.training.validation', 'Validation:')}
          </Typography>
          {organizationId ? (
            <Typography variant="body1" className={classes.data}>
              {t('trainingCompliance.common.selfValidated', 'Self Validated')}
            </Typography>
          ) : (
            <React.Fragment>
              <Grid item className={classes.data}>
                <VerifiedUserIcon style={{ fontSize: 20 }} color="secondary" />
              </Grid>
              <Grid item>
                <Typography variant="body1" style={{ fontWeight: 500 }} color="secondary">
                  {t('trainingCompliance.common.PECValidated', 'PEC Validated')}
                </Typography>
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="body1" className={classes.label}>
            {t('trainingCompliance.operator.training.expiration', 'Expiration:')}
          </Typography>
          <Typography variant="body1" className={classes.data}>
            {expirationMillis && expirationUnits ? (
              <React.Fragment>
                {t('trainingCompliance.operator.training.afterCompletion', {
                  expiration: this.formatExpiration(expirationUnits, expirationMillis),
                  defaultValue: '{{expiration}} after completion'
                })}
              </React.Fragment>
            ) : (
              t('trainingCompliance.common.noExpiration', 'No expiration')
            )}
          </Typography>
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="body1" className={classes.label}>
            {t(
              'trainingCompliance.operator.training.recordOfTrainingUploadRequired',
              'Record of training upload required:'
            )}
          </Typography>
          <Typography variant="body1" className={classes.data}>
            {uploadRequired
              ? t('trainingCompliance.operator.training.yes', 'Yes')
              : t('trainingCompliance.operator.training.no', 'No')}
          </Typography>
        </Grid>
        {compliancePercentageLabel && compliancePercentage !== undefined && (
          <Grid item xs={12} className={classes.gridItem}>
            <Typography variant="body1" className={classes.label}>
              {compliancePercentageLabel}
            </Typography>
            <Typography variant="body1" className={classes.data}>
              {formatCompliancePercentage(compliancePercentage)}%
            </Typography>
          </Grid>
        )}
      </GridContainer>
    );
  }
}

export const TrainingInfoComponent = withStyles(styles)(withTranslation()(TrainingInfo));
