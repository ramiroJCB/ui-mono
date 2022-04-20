import * as React from 'react';
import amber from '@material-ui/core/colors/amber';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import HelpIcon from '@material-ui/icons/Help';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import { LabeledIcon } from 'components/LabeledIcon';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@material-ui/core';

const {
  Incomplete,
  Completable,
  CompletableNotApplicable,
  SubmittedNotApplicable,
  SubmittedComplete,
  AcceptedNotApplicable,
  Accepted,
  Rejected,
  RejectedNotApplicable
} = SafetyProgramRequirementStatus;

type OwnProps = {
  status: SafetyProgramRequirementStatus;
  iconOnly?: boolean;
};

type Props = React.HTMLAttributes<HTMLSpanElement> & OwnProps;

export const RequirementStatusComponent: React.FC<Props> = ({ status, iconOnly, ...props }) => {
  const { t } = useTranslation();

  const elements = {
    [Incomplete]: {
      icon: <HelpIcon style={{ color: amber[700] }} />,
      label: t('safetyPrograms.requirement.incomplete', 'Incomplete'),
      description: t(
        'safetyPrograms.requirement.incompleteDescription',
        'The contractor has not answered all required questions and/or uploaded and lassoed document.'
      )
    },
    [Completable]: {
      icon: <CheckCircleIcon style={{ color: amber[700] }} />,
      label: t('safetyPrograms.requirement.readyToSubmit', 'Ready to Submit'),
      description: t(
        'safetyPrograms.requirement.readyToSubmitDescription',
        'Contractor has answered all required questions, has uploaded documentation, and selected appropriate section but has yet to submit the program for review.'
      )
    },
    [CompletableNotApplicable]: {
      icon: <CheckCircleIcon style={{ color: amber[700] }} />,
      label: t('safetyPrograms.requirement.readyToSubmit', 'Ready to Submit'),
      description: t(
        'safetyPrograms.requirement.readyToSubmitDescription',
        'Contractor has answered all required questions, has uploaded documentation, and selected appropriate section but has yet to submit the program for review.'
      )
    },
    [SubmittedNotApplicable]: {
      icon: <RemoveCircleIcon color="disabled" />,
      label: t('safetyPrograms.requirement.NAPendingReview', 'N/A Pending Review'),
      description: t(
        'safetyPrograms.requirement.NAPendingReviewDescription',
        'The contractor has indicated they do not have this program in place and are awaiting review by Veriforce verification specialists.'
      )
    },
    [SubmittedComplete]: {
      icon: <CheckCircleIcon color="disabled" />,
      label: t('safetyPrograms.requirement.pendingReview', 'Pending Review'),
      description: t(
        'safetyPrograms.requirement.pendingReviewDescription',
        'The contractor has indicated they have a program in place, has answered all necessary questions and submitted the program for review by Veriforce verification specialists.'
      )
    },
    [AcceptedNotApplicable]: {
      icon: <RemoveCircleIcon color="secondary" />,
      label: t('safetyPrograms.requirement.acceptedNA', 'Accepted N/A'),
      description: t(
        'safetyPrograms.requirement.acceptedNADescription',
        'The contractor indicated they do not have this program in place and Veriforce Verification Specialists have confirmed this program may not apply to this contractor.'
      )
    },
    [Accepted]: {
      icon: <CheckCircleIcon color="secondary" />,
      label: t('safetyPrograms.common.accepted', 'Accepted'),
      description: t(
        'safetyPrograms.common.acceptedDescription',
        'The contractor indicated they do have this program in place and it has been reviewed by Veriforce Verification Specialists and meets all program requirements.'
      )
    },
    [Rejected]: {
      icon: <CancelIcon color="error" />,
      label: t('safetyPrograms.common.rejected', 'Rejected'),
      description: t(
        'safetyPrograms.common.rejectedDescription',
        'Veriforce verification specialists have reviewed the submitted program and found it does not meet necessary requirements.'
      )
    },
    [RejectedNotApplicable]: {
      icon: <RemoveCircleIcon color="error" />,
      label: t('safetyPrograms.requirement.rejectedNA', 'Rejected N/A'),
      description: t(
        'safetyPrograms.requirement.rejectedNADescription',
        'Contractor indicated that this requirement should not apply. This will count against their total score for each hiring client until they grant an Exception for this program.'
      )
    }
  };

  const { icon, label, description } = elements[status];

  return iconOnly ? (
    <Tooltip title={`${label}: ${description}`}>{icon}</Tooltip>
  ) : (
    <LabeledIcon icon={icon} label={label} tooltip={description} {...props} />
  );
};
