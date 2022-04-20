import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { EvaluatorQuestionsRowsComponent } from './EvaluatorQuestionsRows';
import { EvaluatorRequirementBreadcrumbs } from './EvaluatorBreadcrumbs';
import { GracePeriodDetails } from './GracePeriodDetails';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { IOverride } from 'interfaces/override';
import { RequirementStatusComponent } from './Status';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Paper } from 'components/Paper';
import { Trans, useTranslation } from 'react-i18next';
import { localizeDate, localizeDateTime } from '@pec/aion-ui-i18next/helpers/localize';

const styles = () => ({
  tableCell: {
    fontSize: 16
  },
  status: {
    lineHeight: 2
  },
  override: {
    margin: 0,
    '& > span:first-child': {
      padding: 0
    },
    '& svg': {
      marginRight: 2
    }
  }
});

type OwnProps = {
  organizationId?: string;
  safetyProgramRequirementId: string;
  requirement: DeepReadonly<IContractorRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
  search: string;
  clientScoreOverride?: DeepReadonly<IOverride> | null;
  handleChangeOverride?: (event: React.ChangeEvent, checked: boolean) => void;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  organizationId,
  safetyProgramRequirementId,
  requirement,
  isFetching,
  search,
  error,
  classes
}) => {
  const date = requirement?.lastContractorActivityDateUtc && new Date(requirement.lastContractorActivityDateUtc);

  const { t } = useTranslation();

  return (
    <GridContainer>
      <EvaluatorRequirementBreadcrumbs
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        isFetching={isFetching}
        requirement={requirement}
        search={search}
      />
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          {requirement && (
            <GridContainer>
              <Grid item style={{ flex: 1 }}>
                <Typography variant="h6" paragraph>
                  {requirement.contractorName}
                  {requirement.contractorCompanyNumber ? ` (${requirement.contractorCompanyNumber})` : ''}:{' '}
                  {requirement.safetyProgram.title}
                </Typography>
                <GracePeriodDetails requirement={requirement} />
                <Typography display="inline" color="textPrimary">
                  {t(
                    'safetyPrograms.requirement.selectQuestion',
                    'Select a question below to review the contractor’s answer. '
                  )}
                </Typography>
                {date && (
                  <Typography display="inline" color="textSecondary">
                    <Trans i18nKey="safetyPrograms.requirement.lastActivityWasOn">
                      Last activity was on{' '}
                      <span title={localizeDateTime(date, t)}>{{ date: localizeDate(date, t) }}</span>.
                    </Trans>
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography paragraph className={classes.status}>
                  <RequirementStatusComponent status={requirement.status} />
                </Typography>
              </Grid>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCell}>
                      {t('safetyPrograms.common.question', 'Question')}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {t('safetyPrograms.common.status', 'Status')}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="right">
                      {t('safetyPrograms.common.comments', 'Comments')}
                    </TableCell>
                    <TableCell className={classes.tableCell} align="center">
                      {t('safetyPrograms.common.view', 'View')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <EvaluatorQuestionsRowsComponent
                    organizationId={organizationId}
                    topLevelQuestions={requirement.questions}
                    answers={requirement.questionAnswers}
                    questions={requirement.questions}
                    safetyProgramRequirementId={safetyProgramRequirementId}
                  />
                </TableBody>
              </Table>
            </GridContainer>
          )}
        </Paper>
      </Grid>
    </GridContainer>
  );
};

export const EvaluatorRequirementComponent = withStyles(styles)(Component);
