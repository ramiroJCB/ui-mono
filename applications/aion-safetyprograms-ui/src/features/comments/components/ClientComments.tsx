import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { CommentComponent } from 'features/comment/components/Comment';
import { DeepReadonly } from 'ts-essentials';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IComment } from 'interfaces/comment';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { Paper } from 'components/Paper';
import { useTranslation } from 'react-i18next';

const styles = (theme: Theme) => ({
  paper: {
    paddingTop: theme.spacing(1.5)
  }
});

type OwnProps = {
  comments: DeepReadonly<IComment[]> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | null;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({ comments, isFetching, error, classes }) => {
  const { t } = useTranslation();

  return (
    <Paper elevation={0} hasError={!!error} isLoading={isFetching} className={classes.paper}>
      <GridContainer style={{ padding: 0 }}>
        <Grid item xs={12}>
          <Typography variant="subtitle2">
            {t('safetyPrograms.common.questionDiscussion', 'Question Discussion')}
          </Typography>
        </Grid>
        {comments &&
          (comments.length > 0 ? (
            <Grid item xs={12} style={{ padding: 0 }}>
              {comments.map(comment => (
                <CommentComponent key={comment.id} comment={comment} isUpdating={false} isEvaluator={false} />
              ))}
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary">
                {t('safetyPrograms.common.questionHasNoComments', 'This question has no comments.')}
              </Typography>
            </Grid>
          ))}
      </GridContainer>
    </Paper>
  );
};

export const ClientCommentsComponent = withStyles(styles)(Component);
