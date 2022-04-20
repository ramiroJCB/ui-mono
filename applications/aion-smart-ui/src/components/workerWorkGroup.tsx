import * as React from 'react';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import withWidth, { WithWidth } from '@material-ui/core/withWidth';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import WarningIcon from '@material-ui/icons/Warning';
import CheckIcon from '@material-ui/icons/Check';
import { IconListItem } from '@pec/aion-ui-components/components/IconListItem';
import Grid from '@material-ui/core/Grid';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { IEmployeeTrainingByWorkGroup } from 'interfaces/employeeTrainingByWorkgroup';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const styles = (theme: Theme) => ({
  NoncompliantIcon: {
    backgroundColor: theme.palette.error.main
  },
  Compliant: {
    backgroundColor: theme.palette.secondary.main
  },
  title: {
    color: theme.palette.primary.main,
    'font-weight': 500,
    padding: '10px 0 0 16px'
  },
  word: {
    color: theme.palette.primary.main,
    padding: '5px 0 0 26px'
  },
  breadcrumbBold: {
    fontWeight: 600,
    textDecoration: 'none',
    '& p': {
      fontWeight: 600
    },
    '&': {
      color: theme.palette.text.primary
    }
  }
});

type OwnProps = {
  workGroup: IEmployeeTrainingByWorkGroup;
  nameWorkGroupSelected: string;
  handleGoBackWorkerSelected: () => void;
  firstName: string;
  lastName: string;
};

type Props = WithStyles<typeof styles> & WithWidth & OwnProps;

const WorkerWorkGroup: React.FC<Props> = ({
  classes,
  workGroup: { item },
  handleGoBackWorkerSelected,
  nameWorkGroupSelected,
  firstName,
  lastName
}) => {
  let status: boolean = true;
  const { t } = useTranslation();
  Object.keys(item.jobTypes).map(jobTypeId =>
    Object.keys(item.jobTypes[jobTypeId].trainingRequirements).map(
      trainingRequirementId =>
        (status = status && item.jobTypes[jobTypeId].trainingRequirements[trainingRequirementId]['isCompliant'])
    )
  );
  return (
    <GridContainer spacing={0}>
      <Button color="primary" style={{ padding: 0 }} onClick={handleGoBackWorkerSelected}>
        <ArrowBackIosIcon />
      </Button>
      <Typography className={classes.breadcrumbBold}>{`${firstName} ${lastName}`}</Typography>

      <IconListItem
        icon={status ? <CheckIcon /> : <WarningIcon />}
        primaryText={nameWorkGroupSelected}
        className={status ? classes.Compliant : classes.NoncompliantIcon}
      >
        {status ? t('smart.common.compliant', 'Compliant') : t('smart.common.noncompliant', 'Noncompliant')}
      </IconListItem>
      {Object.keys(item.jobTypes).map(jobTypeId => {
        return (
          <React.Fragment>
            <Grid item xs={12} md={12}>
              <Typography className={classes.title}>{item.jobTypes[jobTypeId]['jobTypeName']}</Typography>
            </Grid>
            {Object.keys(item.jobTypes[jobTypeId].trainingRequirements).map(trainingRequirementId => {
              return (
                <React.Fragment>
                  <Grid item justify="flex-end" alignItems="flex-start" direction="row" xs={12} sm={6} md={6}>
                    <Typography className={classes.word}>
                      {item.jobTypes[jobTypeId].trainingRequirements[trainingRequirementId]['name']}
                    </Typography>
                  </Grid>
                  <Grid item justify="flex-end" alignItems="flex-start" direction="row" xs={12} sm={6} md={6}>
                    {item.jobTypes[jobTypeId].trainingRequirements[trainingRequirementId]['isCompliant'] ? (
                      <Typography className={classes.word}>
                        <FiberManualRecordIcon color="secondary" fontSize="inherit" />
                        {t('smart.workerWorkGroup.compliantTime', {
                          defaultValue: 'Compliant {{date}}',
                          date: localizeDate(
                            item.jobTypes[jobTypeId].trainingRequirements[trainingRequirementId]['completionDateUtc'],
                            t
                          )
                        })}
                      </Typography>
                    ) : (
                      <Typography className={classes.word}>
                        <FiberManualRecordIcon color="error" fontSize="inherit" />
                        {t('smart.workerWorkGroup.noncompliant', 'Noncompliant')}
                      </Typography>
                    )}
                  </Grid>
                </React.Fragment>
              );
            })}
          </React.Fragment>
        );
      })}
    </GridContainer>
  );
};

export const WorkerWorkGroupComponent = withWidth()(withStyles(styles)(WorkerWorkGroup));
