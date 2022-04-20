import * as React from 'react';
import { Typography } from '@material-ui/core';
import { IPECEmployee } from 'interfaces/PECEmployee';
import { Trans } from 'react-i18next';
import { useTranslation } from 'react-i18next';

type Props = {
  employee: IPECEmployee | undefined;
};

export const NoMatches: React.FC<Props> = (props: Props) => {
  const { employee } = props;
  const { t } = useTranslation();

  return (
    <Typography>
      {employee && (
        <Trans i18nKey="employee.verisourceNoResults.noMatches">
          No matches were detected for&nbsp;
          <b>
            {{ traineeFirstName: employee.traineeFirstName }}
            {{ traineeLastName: employee.traineeLastName }}
          </b>
          .<br />
        </Trans>
      )}
      {t(
        'employee.verisourceNoResults.chooseADifferentPecEmployee',
        'Choose a different PEC employee or search VeriSource employees to find a match.'
      )}
    </Typography>
  );
};
