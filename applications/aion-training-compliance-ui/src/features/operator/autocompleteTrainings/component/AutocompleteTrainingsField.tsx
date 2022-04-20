import * as React from 'react';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { Field } from 'react-final-form';
import { ITrainingRequirement } from '@pec/aion-ui-core/interfaces/trainingRequirement';
import { makeStyles } from '@material-ui/core/styles';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { TrainingOptionType } from 'interfaces/trainingOption';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
  pecValidated: {
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 4
  }
});

type Props = {
  label?: string;
  className?: string;
  validate?: (values: ITrainingRequirement[]) => Promise<JSX.Element | string | undefined>;
  loadOptions: (
    inputValue: string,
    prevOptions: TrainingOptionType[],
    additional: SelectAdditional
  ) => Promise<AsyncResult<TrainingOptionType, SelectAdditional>>;
};

export const AutocompleteTrainingsField: React.FC<Props> = ({ loadOptions, validate, label, className }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Field name="trainings" validate={validate}>
      {props => (
        <AsyncSelectField<TrainingOptionType>
          label={label}
          loadOptions={loadOptions}
          closeMenuOnSelect={false}
          placeholder={t('trainingCompliance.operator.autocompleteTrainings.selectRequirements', 'Select Requirements')}
          getOptionLabel={({ organizationId, name }) =>
            organizationId
              ? name
              : ((
                  <span className={classes.pecValidated}>
                    {name} <VerifiedUserIcon color="secondary" fontSize="small" className={classes.icon} />
                  </span>
                ) as any)
          }
          getOptionValue={({ id }) => id}
          className={className}
          {...props}
        />
      )}
    </Field>
  );
};
