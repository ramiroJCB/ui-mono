import * as React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ComplianceLevel } from 'interfaces/complianceLevel';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { EmployeeTrainingRequirementUploadedDocumentsContainer } from '../containers/EmployeeTrainingUploadedDocuments';
import { FormApi } from 'final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { IEmployeeTrainingRequirement } from 'interfaces/employeeTrainingRequirement';
import { IEmployeeTrainingRequirementForm } from 'interfaces/employeeTrainingRequirementForm';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TrainingInfoComponent } from 'features/operator/training/components/TrainingInfo';
import { useTranslation } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const styles = (theme: Theme) =>
  createStyles({
    gridItem: {
      display: 'flex'
    },
    label: {
      fontWeight: 'bold'
    },
    icon: {
      padding: '0 0.5em'
    },
    data: {
      paddingLeft: theme.spacing(1)
    },
    subheader: {
      display: 'flex',
      '& p:first-child': {
        paddingRight: '0.5em'
      },
      '& p': {
        fontWeight: 'bold'
      }
    },
    compliant: {
      color: theme.palette.secondary.main
    },
    noncompliant: {
      color: theme.palette.error.main
    }
  });

type OwnProps = {
  employeeTrainingRequirement: DeepReadonly<IEmployeeTrainingRequirement>;
  uploadedDocuments: IDocumentWithStatus[];
  form?: FormApi<IEmployeeTrainingRequirementForm>;
};

type Props = WithStyles<typeof styles> & OwnProps;

export const EmployeeTrainingInfoComponent: React.FC<Props> = ({
  classes,
  uploadedDocuments,

  form,
  employeeTrainingRequirement: {
    trainingRequirement,
    completionDateUtc,
    status,
    employee: { name }
  }
}) => {
  const { t } = useTranslation();
  const completionDate = completionDateUtc ? new Date(completionDateUtc) : null;
  const expirationDate =
    trainingRequirement.expirationMillis && trainingRequirement.expirationUnits && completionDateUtc
      ? new Date(completionDateUtc).setMilliseconds(trainingRequirement.expirationMillis)
      : null;

  const isExpired = expirationDate ? new Date() > new Date(expirationDate) : null;

  return (
    <Paper>
      <TrainingInfoComponent
        trainingRequirement={trainingRequirement}
        subHeader={
          <div className={classes.subheader}>
            <Typography variant="body1">{name}</Typography>
            <Typography
              variant="body1"
              className={status === ComplianceLevel.Compliant ? classes.compliant : classes.noncompliant}
            >
              {status === ComplianceLevel.Compliant
                ? t('trainingCompliance.common.compliant', 'Compliant')
                : t('trainingCompliance.common.nonCompliant', 'Noncompliant')}
            </Typography>
          </div>
        }
      />
      <GridContainer>
        <Grid item xs={12} xl={4} className={classes.gridItem}>
          <Typography variant="body1" className={classes.label}>
            {t('trainingCompliance.contractor.employeeTrainingRequirement.completionDate', 'Completion Date:')}
          </Typography>
          <Typography variant="body1" className={classes.data}>
            {completionDate
              ? localizeDate(completionDate, t)
              : t('trainingCompliance.contractor.employeeTrainingRequirement.noneProvided', 'None provided')}
          </Typography>
        </Grid>
        <Grid item xs={12} xl={4} className={classes.gridItem}>
          <Typography variant="body1" className={classes.label}>
            {t('trainingCompliance.contractor.employeeTrainingRequirement.expirationDate', 'Expiration Date:')}
          </Typography>
          <Typography variant="body1" className={classes.data}>
            {expirationDate
              ? localizeDate(expirationDate, t)
              : !completionDate
              ? t(
                  'trainingCompliance.contractor.employeeTrainingRequirement.completionDateNeeded',
                  'Completion date needed'
                )
              : t('trainingCompliance.common.noExpiration', 'No expiration')}
          </Typography>
          {completionDate &&
            (!isExpired ? <CheckIcon className={classes.compliant} /> : <CloseIcon className={classes.noncompliant} />)}
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <Typography variant="body1" className={classes.label}>
            {t('trainingCompliance.contractor.employeeTrainingRequirement.uploadedDocuments', 'Uploaded Documents:')}
          </Typography>
          {uploadedDocuments.length === 0 && (
            <Typography variant="body1" className={classes.data}>
              {t('trainingCompliance.contractor.employeeTrainingRequirement.noneProvided', 'None provided')}
            </Typography>
          )}
        </Grid>
        {uploadedDocuments.length > 0 && (
          <Grid item xs={12}>
            <EmployeeTrainingRequirementUploadedDocumentsContainer form={form} documents={uploadedDocuments} />
          </Grid>
        )}
      </GridContainer>
    </Paper>
  );
};

export const EmployeeTrainingInfo = withStyles(styles)(EmployeeTrainingInfoComponent);
