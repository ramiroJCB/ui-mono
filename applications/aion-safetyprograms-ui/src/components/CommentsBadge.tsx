import * as React from 'react';
import Badge from '@material-ui/core/Badge';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type Props = {
  hasUnreadComments: boolean;
  numberOfComments: number;
};

// Matches hard-coded value of MUI Badge padding
const marginRight = 6;

export const CommentsBadge: React.FC<Props> = ({ hasUnreadComments, numberOfComments }) => {
  const { t } = useTranslation();

  return (
    <Badge style={{ marginRight }} variant="dot" color="error" badgeContent={Number(hasUnreadComments)}>
      <span style={{ marginRight }}>{localizeNumber(numberOfComments, t)}</span>
    </Badge>
  );
};
