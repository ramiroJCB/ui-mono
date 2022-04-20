import * as React from 'react';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  gridItem: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingLeft: 0
  }
});

type OwnProps = {
  organizationId?: string;
  safetyProgramRequirementId: string;
  questionId: string;
  questionNumber: string | null;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  organizationId,
  safetyProgramRequirementId,
  questionId,
  questionNumber,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12} className={classes.gridItem} style={{ paddingLeft: 0 }}>
      <Button
        component={Link}
        to={
          organizationId
            ? `/organizations/${organizationId}/safety-program-requirements/${safetyProgramRequirementId}/questions/${questionId}`
            : `/safety-program-requirements/${safetyProgramRequirementId}/questions/${questionId}`
        }
      >
        <ArrowBackRoundedIcon />
        {t('safetyPrograms.question.backToQuestion', {
          questionNumber: questionNumber,
          defaultValue: 'Back to Question {{questionNumber}}'
        })}
      </Button>
    </Grid>
  );
};

export const QuestionBackButton = withStyles(styles)(Component);
