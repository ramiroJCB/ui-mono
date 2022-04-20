import * as React from 'react';
import { AsyncResult } from 'react-select-async-paginate';
import { AsyncSelectField } from '@pec/aion-ui-form/components/Autocomplete/AsyncSelectField';
import { Field } from 'react-final-form';
import { IServiceRegion } from '@pec/aion-ui-core/interfaces/serviceRegion';
import { SelectAdditional } from '@pec/aion-ui-form/types/selectAdditional';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const styles = () => ({
  autoCompleteField: {
    marginTop: 12
  }
});

type OwnProps = {
  validate?: (values: IServiceRegion[]) => Promise<JSX.Element | string | undefined>;
  loadOptions: (
    inputValue: string,
    prevOptions: IServiceRegion[],
    additional: SelectAdditional
  ) => Promise<AsyncResult<IServiceRegion, SelectAdditional>>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const AutocompleteServiceRegionsFieldComponent: React.FC<Props> = ({ classes, loadOptions, validate }) => {
  const { t } = useTranslation();

  return (
    <Field name="serviceRegions" validate={validate}>
      {props => (
        <AsyncSelectField<IServiceRegion>
          loadOptions={loadOptions}
          closeMenuOnSelect={false}
          placeholder={t(
            'trainingCompliance.operator.autocompleteServiceRegions.assignContractorsByIndustry',
            'Assign Contractors By Industry'
          )}
          getOptionLabel={({ description }) => description}
          getOptionValue={({ id }) => id}
          className={classes.autoCompleteField}
          {...props}
        />
      )}
    </Field>
  );
};

export const AutocompleteServiceRegionsField = withStyles(styles)(AutocompleteServiceRegionsFieldComponent);
