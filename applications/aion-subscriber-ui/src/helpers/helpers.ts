import { Theme } from '@material-ui/core/styles';

export const getPredictiveRankingScoreString = (score: number) =>
  ({
    1: 'Standard Risk',
    2: 'Elevated Risk',
    3: 'High Risk'
  }[score] || 'Standard Risk');

export const getPredictiveRankingScoreColor = (theme: Theme, score: number) =>
  ({
    1: theme.palette.secondary.main,
    2: theme.palette.error.light,
    3: theme.palette.error.main
  }[score] || theme.palette.secondary.main);
