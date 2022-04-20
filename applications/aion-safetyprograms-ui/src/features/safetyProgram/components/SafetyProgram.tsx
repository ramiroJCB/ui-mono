import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IExpandedSafetyProgram } from 'interfaces/safetyProgram';
import { Link } from 'react-router-dom';
import { SafetyProgramQuestionsRowsComponent } from './QuestionsRows';
import { Paper } from 'components/Paper';
import { useSharedTableStyles } from 'hooks/useSharedTableStyles';
import { useTranslation } from 'react-i18next';

type Props = {
  safetyProgramId: string;
  safetyProgram: DeepReadonly<IExpandedSafetyProgram> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
};

export const SafetyProgramComponent: React.FC<Props> = ({ safetyProgramId, safetyProgram, isFetching, error }) => {
  const classes = useSharedTableStyles();
  const { t } = useTranslation();

  return (
    <GridContainer>
      <Grid item xs={12}>
        <Breadcrumbs
          links={[
            {
              to: '/safety-programs',
              children: t('safetyPrograms.common.programEditor', 'Program Editor')
            },
            {
              to: `/safety-programs/${safetyProgramId}`,
              children: !isFetching && safetyProgram ? safetyProgram.title : '⋯'
            }
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching}>
          <GridContainer alignItems="center">
            {safetyProgram && (
              <React.Fragment>
                <Grid item style={{ flex: 1 }}>
                  <Typography variant="h6">{safetyProgram.title}</Typography>
                </Grid>
                <Grid item>
                  <Button component={Link} to={`/safety-programs/${safetyProgram.id}/edit`}>
                    {t('safetyPrograms.common.editProgram', 'Edit Program')}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={`/safety-programs/${safetyProgram.id}/questions/add`}
                  >
                    <AddIcon />
                    {t('safetyPrograms.common.addQuestion', 'Add Question')}
                  </Button>
                </Grid>
              </React.Fragment>
            )}
            <Table style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col width="62.5%" />
                <col width="15%" />
                <col width="15%" />
                <col width="7.5%" />
              </colgroup>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableCell}>{t('safetyPrograms.common.question', 'Question')}</TableCell>
                  <TableCell className={classes.tableCell}>
                    {t('safetyPrograms.common.lastChange', 'Last Change')}
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    {t('safetyPrograms.common.changedBy', 'Changed By')}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="center">
                    {t('safetyPrograms.common.edit', 'Edit')}
                  </TableCell>
                </TableRow>
              </TableHead>
              {safetyProgram && (
                <TableBody>
                  {safetyProgram.questions.length > 0 ? (
                    <SafetyProgramQuestionsRowsComponent
                      topLevelQuestions={safetyProgram.questions}
                      questions={safetyProgram.questions}
                      safetyProgramId={safetyProgramId}
                    />
                  ) : (
                    <TableRow>
                      <TableCell align="center" colSpan={4}>
                        {t('safetyPrograms.safetyProgram.addQuestion', 'Please add a question to get started.')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </GridContainer>
        </Paper>
      </Grid>
    </GridContainer>
  );
};
