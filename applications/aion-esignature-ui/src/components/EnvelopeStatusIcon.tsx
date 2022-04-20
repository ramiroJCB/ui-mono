import * as React from 'react';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { EnvelopeStatus } from '@pec/aion-ui-core/interfaces/envelope';
import { useTranslation } from 'react-i18next';
import { localizeEnvelopeStatusDescription } from 'helpers/envelope';

const { Completed, NotSigned, WaitingForOthers } = EnvelopeStatus;

const styles = (theme: Theme) =>
  createStyles({
    icon: {
      marginTop: theme.spacing(0.5),
      display: 'inline-block'
    },
    waitingForOthers: {
      color: '#E99842'
    },
    complete: {
      color: theme.palette.secondary.main
    },
    notSigned: {
      color: theme.palette.error.main
    }
  });

type OwnProps = {
  status: EnvelopeStatus;
  tooltipPlacement?: TooltipProps['placement'];
};

type Props = OwnProps & WithStyles<typeof styles>;

const EnvelopeStatusIconComponent: React.FC<Props> = ({ status, classes, tooltipPlacement }) => {
  const { t } = useTranslation();

  const renderStatusIcon = () => {
    switch (status) {
      case NotSigned:
        return <ErrorIcon className={`${classes.icon} ${classes.notSigned}`} />;
      case Completed:
        return <CheckCircleIcon className={`${classes.icon} ${classes.complete}`} />;
      case WaitingForOthers:
        return <ErrorIcon className={`${classes.icon} ${classes.waitingForOthers}`} />;
      default:
        return <ErrorOutlineIcon />;
    }
  };
  return (
    <React.Fragment>
      {tooltipPlacement ? (
        <Tooltip
          title={localizeEnvelopeStatusDescription(status, t) || t('eSignature.common.unknown', 'Unknown').toString()}
          enterDelay={300}
          placement={tooltipPlacement}
        >
          {renderStatusIcon()}
        </Tooltip>
      ) : (
        renderStatusIcon()
      )}
    </React.Fragment>
  );
};

export const EnvelopeStatusIcon = withStyles(styles)(EnvelopeStatusIconComponent);
