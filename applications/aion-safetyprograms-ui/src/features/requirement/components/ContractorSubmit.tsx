import * as React from 'react';
import Button from '@material-ui/core/Button';
import { DeepReadonly } from 'ts-essentials';
import { SafetyProgramRequirementStatus } from '@pec/aion-ui-core/interfaces/safetyProgramRequirementStatus';
import { IContractorRequirement } from 'interfaces/requirement';
import { Dialog, DialogContent, DialogContentText, DialogActions, DialogTitle } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

type Props = {
  requirement: DeepReadonly<IContractorRequirement> | null;
  handleClickSubmit: () => void;
};

export const ContractorSubmit: React.FC<Props> = ({ requirement, handleClickSubmit }) => {
  const [rejectionWarning, setRejectionWarning] = React.useState(false);
  const { t } = useTranslation();
  const { status } = requirement ? requirement : { status: null };

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="secondary"
        disabled={
          (requirement &&
            requirement.status !== SafetyProgramRequirementStatus.Completable &&
            requirement.status !== SafetyProgramRequirementStatus.CompletableNotApplicable) ||
          false
        }
        onClick={() =>
          status === SafetyProgramRequirementStatus.CompletableNotApplicable
            ? setRejectionWarning(true)
            : handleClickSubmit()
        }
      >
        {t('safetyPrograms.requirement.submitProgram', 'Submit Program')}
      </Button>
      <Dialog open={rejectionWarning}>
        <DialogTitle>{t('safetyPrograms.requirement.rejectionWarning', 'Rejection Warning')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(
              'safetyPrograms.requirement.submittingProgram',
              'Submitting a program for review without supplying a safety program will automatically reject this program and may cause non-compliance for certain clients.'
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setRejectionWarning(false)}>
            {t('safetyPrograms.common.cancel', 'Cancel')}
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              handleClickSubmit();
              setRejectionWarning(false);
            }}
          >
            {t('safetyPrograms.requirement.continue', 'Continue')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
