import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { ContractorQuestionsRowsComponent } from './ContractorQuestionsRows';
import { ContractorRequirementBreadcrumbs } from './ContractorBreadcrumbs';
import { ContractorSubmitContainer } from '../containers/ContractorSubmit';
import { DeepReadonly } from 'utility-types';
import { GracePeriodDetails } from './GracePeriodDetails';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IContractorRequirement } from 'interfaces/requirement';
import { Link } from 'react-router-dom';
import { RequirementStatusComponent } from './Status';
import Button from '@material-ui/core/Button';
import { Paper } from 'components/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSafetyProgram } from 'features/safetyProgram/actions/fetchSafetyProgram';
import { useEffect } from 'react';
import { RootState } from 'combineReducers';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { ShopBanner } from './ShopBanner';
import Box from '@material-ui/core/Box/Box';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  safetyProgramRequirementId: string;
  requirement: DeepReadonly<IContractorRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
};

export const ContractorRequirementComponent: React.FC<Props> = ({
  organizationId,
  safetyProgramRequirementId,
  requirement,
  isFetching,
  error
}) => {
  const { safetyProgram } = useSelector((state: RootState) => state.safetyProgram);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (requirement) {
      dispatch(fetchSafetyProgram(requirement.safetyProgramId));
    }
  }, [dispatch, requirement]);

  return (
    <GridContainer>
      <ContractorRequirementBreadcrumbs
        organizationId={organizationId}
        safetyProgramRequirementId={safetyProgramRequirementId}
        isFetching={isFetching}
        requirement={requirement}
      />

      <Grid item xs={12}>
        {requirement &&
          safetyProgram &&
          safetyProgram.showShopLink &&
          requirement.status === SafetyProgramRequirementStatus.Rejected && (
            <Box mb={2}>
              <ShopBanner shopLink={safetyProgram.shopLink} />
            </Box>
          )}
        <Paper hasError={!!error} isLoading={isFetching}>
          {requirement && (
            <GridContainer>
              <Grid item style={{ flex: 1 }}>
                <Typography variant="h6" paragraph>
                  {requirement.safetyProgram.title}
                </Typography>
                <GracePeriodDetails requirement={requirement} />
                <Typography color="textPrimary">
                  {t(
                    'safetyPrograms.requirement.clickOnEachQuestion',
                    'Click on each question below to provide your answer. Click on “Submit Program” when you’ve answered all the questions.'
                  )}
                </Typography>
              </Grid>
              <Grid item style={{ padding: 0 }}>
                <GridContainer alignItems="center">
                  <Grid item>
                    <Typography>
                      <RequirementStatusComponent status={requirement.status} />
                    </Typography>
                  </Grid>
                  {requirement.status === 'RejectedNotApplicable' && (
                    <Grid item>
                      <Button
                        component={Link}
                        color="primary"
                        variant="contained"
                        to={`/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/exceptions`}
                      >
                        {t('safetyPrograms.requirement.requestException', 'Request Exception')}
                      </Button>
                    </Grid>
                  )}
                  <Grid item>
                    <ContractorSubmitContainer safetyProgramRequirementId={safetyProgramRequirementId} />
                  </Grid>
                </GridContainer>
              </Grid>
              <Grid item xs={12}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('safetyPrograms.common.question', 'Question')}</TableCell>
                      <TableCell align="center">{t('safetyPrograms.requirement.completed', 'Completed')}</TableCell>
                      <TableCell align="right">{t('safetyPrograms.common.comments', 'Comments')}</TableCell>
                      <TableCell align="center">{t('safetyPrograms.common.view', 'View')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <ContractorQuestionsRowsComponent
                      topLevelQuestions={requirement.questions}
                      answers={requirement.questionAnswers}
                      questions={requirement.questions}
                      organizationId={organizationId}
                      safetyProgramRequirementId={safetyProgramRequirementId}
                    />
                  </TableBody>
                </Table>
              </Grid>
            </GridContainer>
          )}
        </Paper>
      </Grid>
    </GridContainer>
  );
};
