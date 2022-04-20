import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'utility-types';
import { INestedQuestion } from 'interfaces/question';

type Props = {
  fileName: string;
  question: DeepReadonly<INestedQuestion>;
  questionNumber: string | null;
};

export const ReferenceContext: React.FC<Props> = ({ fileName, question, questionNumber }) => (
  <Grid item xs={8}>
    <Typography variant="h6" paragraph style={{ overflowWrap: 'anywhere' }}>
      {fileName}
    </Typography>
    <Typography paragraph={!!question.body}>
      {questionNumber ? `${questionNumber}. ` : ''}
      {question.title}
    </Typography>
    {question.body && <Typography variant="body2">{question.body}</Typography>}
  </Grid>
);
