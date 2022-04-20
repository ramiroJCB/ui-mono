import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IWorkGroupJobTypeEmployeeTraining } from '@pec/aion-ui-core/interfaces/workGroupJobTypeEmployeeTraining';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  details: {
    padding: theme.spacing(0, 2)
  },
  row: {
    padding: theme.spacing(1)
  },
  summaryItems: {
    paddingLeft: theme.spacing(1)
  },
  summaryItemsOther: {
    paddingLeft: theme.spacing(2)
  },
  summary: {
    '&:hover': {
      background: theme.palette.action.hover
    }
  }
}));

type Props = {
  workGroupJobTypeEmployeeTraining: IWorkGroupJobTypeEmployeeTraining;
};

export const ReportRow: React.SFC<Props> = ({
  workGroupJobTypeEmployeeTraining: {
    employeeName,
    contractorName,
    workGroupName,
    jobTypeName,
    trainingRequirementName,
    isCompliant,
    completionDateUtc,
    expirationDateUtc,
    validatingCompany,
    hasDocument
  }
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Accordion>
      <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
        <GridContainer spacing={0}>
          <Grid item xs={2}>
            <Typography variant="body1">{employeeName}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="body1">{contractorName}</Typography>
          </Grid>
          <Grid className={classes.summaryItems} item xs={2}>
            <Typography variant="body1">{workGroupName}</Typography>
          </Grid>
          <Grid className={classes.summaryItems} item xs={2}>
            <Typography variant="body1">{jobTypeName}</Typography>
          </Grid>
          <Grid className={classes.summaryItemsOther} item xs={2}>
            <Typography variant="body1">{trainingRequirementName}</Typography>
          </Grid>
          <Grid className={classes.summaryItemsOther} item xs={2}>
            <Typography
              variant="body1"
              style={{
                color: isCompliant ? theme.palette.secondary.main : theme.palette.error.main,
                fontWeight: 'bold'
              }}
            >
              {isCompliant
                ? t('trainingCompliance.common.compliant', 'Compliant')
                : t('trainingCompliance.common.nonCompliant', 'Noncompliant')}
            </Typography>
          </Grid>
        </GridContainer>
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <GridContainer spacing={0}>
          <Grid item container xs={12} md={6}>
            <Grid item className={classes.row} xs={6}>
              <Typography>
                {t('trainingCompliance.operator.assignedEmployeeReport.completionDate', {
                  date: localizeDateTime(completionDateUtc, t),
                  defaultValue: 'Completion Date: {{date}}'
                })}
              </Typography>
            </Grid>
            <Grid className={classes.row} item xs={12}>
              <Typography>
                {t('trainingCompliance.operator.assignedEmployeeReport.expirationDate', {
                  date: expirationDateUtc
                    ? localizeDateTime(expirationDateUtc, t)
                    : t('trainingCompliance.common.noExpiration', 'No Expiration'),
                  defaultValue: 'Expiration Date: {{date}}'
                })}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={6}>
            <Grid className={classes.row} item xs={12}>
              <Typography>
                {t('trainingCompliance.operator.assignedEmployeeReport.validation', {
                  validatingCompany,
                  defaultValue: 'Validation: {{validatingCompany}}'
                })}
              </Typography>
            </Grid>
            <Grid className={classes.row} item xs={12}>
              <Typography>
                {t('trainingCompliance.operator.assignedEmployeeReport.hasDocumentation', {
                  hasDocument,
                  defaultValue: 'Has Documentation: {{hasDocument}}'
                })}
              </Typography>
            </Grid>
          </Grid>
        </GridContainer>
      </AccordionDetails>
    </Accordion>
  );
};
