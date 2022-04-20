import * as React from 'react';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'ts-essentials';
import { IContractorRequirement } from 'interfaces/requirement';
import { INestedQuestion } from 'interfaces/question';
import { Paper } from 'components/Paper';

type Props = {
  requirement: DeepReadonly<IContractorRequirement> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError> | Error | null;
  question?: DeepReadonly<INestedQuestion> | null;
};

export const QuestionPaper: React.FC<Props> = ({ requirement, isFetching, error, question, children }) => (
  <Paper hasError={Boolean(error || (!isFetching && requirement && !question))} isLoading={isFetching}>
    {children}
  </Paper>
);
