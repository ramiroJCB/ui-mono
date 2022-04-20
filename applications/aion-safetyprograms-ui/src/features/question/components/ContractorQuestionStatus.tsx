import * as React from 'react';
import CheckRoundedIcon from '@material-ui/icons/CheckRounded';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import { AnswerStatus } from 'interfaces/answer';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { useTranslation } from 'react-i18next';

const { Incomplete, Completable, Acceptable, AcceptableOrRejectable, Accepted, Rejected, AutoRejected } = AnswerStatus;

type OwnProps = {
  status?: AnswerStatus;
};

type Props = OwnProps & SvgIconProps;

export const ContractorQuestionStatus: React.FC<Props> = ({ status = Incomplete, ...props }) => {
  const { t } = useTranslation();

  switch (status) {
    case Completable:
    case Acceptable:
    case AcceptableOrRejectable:
    case Accepted:
      return (
        <span title={t('safetyPrograms.question.complete', 'Complete')}>
          <CheckRoundedIcon color="secondary" {...props} />
        </span>
      );
    case Rejected:
    case AutoRejected:
      return (
        <span title={t('safetyPrograms.common.rejected', 'Rejected')}>
          <CloseRoundedIcon color="error" {...props} />
        </span>
      );
    default:
      return null;
  }
};
