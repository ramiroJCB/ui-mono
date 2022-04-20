import * as React from 'react';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { INestedQuestion } from 'interfaces/question';
import { Link } from 'react-router-dom';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  divideBottom: {
    borderBottom: `1px solid ${theme.palette.divider}`
  }
});

type OwnProps = {
  question: DeepReadonly<INestedQuestion>;
  questionNumber: string | null;
  nextQuestionUrl?: string;
  prevQuestionUrl?: string;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ question, questionNumber, nextQuestionUrl, prevQuestionUrl, classes }) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {(nextQuestionUrl || prevQuestionUrl) && (
        <Grid item xs={12} className={classes.divideBottom} style={{ paddingLeft: 0, paddingRight: 0 }}>
          <GridContainer justify="space-between" spacing={0}>
            <Grid item>
              {prevQuestionUrl && (
                <Button component={Link} to={prevQuestionUrl}>
                  <ArrowBackRoundedIcon />
                  {t('safetyPrograms.question.previousQuestion', 'Previous Question')}
                </Button>
              )}
            </Grid>
            <Grid item>
              {nextQuestionUrl && (
                <Button component={Link} to={nextQuestionUrl}>
                  {t('safetyPrograms.question.nextQuestion', 'Next Question')}
                  <ArrowForwardRoundedIcon />
                </Button>
              )}
            </Grid>
          </GridContainer>
        </Grid>
      )}
      <Grid item xs={12}>
        <Box mt={2} ml={1} mb={2}>
          <Typography variant="h6">
            {questionNumber ? `${questionNumber}. ` : ''}
            {question.title}
          </Typography>
        </Box>
      </Grid>
    </React.Fragment>
  );
};

export const QuestionContext = withStyles(styles)(Component);
