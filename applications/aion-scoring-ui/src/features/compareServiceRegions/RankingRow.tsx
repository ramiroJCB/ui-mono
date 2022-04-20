import React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Box, useTheme, Typography } from '@material-ui/core';

type Props = {
  name: string;
  aionScore: string;
  legacyScore: string;
};

export const RankingRow: React.FC<Props> = ({ name, aionScore, legacyScore }) => {
  const theme = useTheme();

  const aionEqualsLegacy = (): boolean => {
    const zeroStrings = ['0%', '0.0%', '0.00%'];
    if (aionScore === '0' && zeroStrings.includes(legacyScore)) {
      return true;
    } else {
      return aionScore === legacyScore.replace('%', '');
    }
  };

  const getDifference = (): string => {
    const legacyScoreNum = Number(legacyScore.replace('%', ''));
    const aionScoreNum = Number(aionScore);
    const difference = aionScoreNum - legacyScoreNum;
    const stringDiff = difference.toString();

    if (difference < 0) {
      return stringDiff;
    } else {
      return `+ ${stringDiff}`;
    }
  };

  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell align="center">{aionScore}</TableCell>
      <TableCell align="center">
        {aionEqualsLegacy() ? (
          <Box display="flex" justifyContent="center">
            <CheckCircleIcon style={{ color: theme.palette.secondary.main }} />
            <Typography>Match</Typography>
          </Box>
        ) : (
          <Typography style={{ fontWeight: 500, color: theme.palette.error.main }}>{getDifference()}</Typography>
        )}
      </TableCell>
    </TableRow>
  );
};
