import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect, useState } from 'react';
import { businessUnitsSelectors, fetchBusinessUnits } from 'features/client/businessUnits/slice';
import { Error } from '@pec/aion-ui-components/components/Error';
import { Field, useForm } from 'react-final-form';
import { IInspectionForm } from 'interfaces/inspection';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { required } from '@pec/aion-ui-core/validators';
import { SelectField } from '@pec/aion-ui-form/components/SelectField';
import { store } from 'app/store';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

type Props = {
  contractorId: string;
};

export const SelectBusinessUnits: React.FC<Props> = ({ contractorId }) => {
  const dispatch = useAppDispatch();
  const form = useForm<IInspectionForm>();
  const { organizationId } = useParams<{ organizationId: string }>();

  const [options, setOptions] = useState<Option[]>([]);
  const { hasFetched, isFetching, error, total } = useTypedSelector(state => state.businessUnits);

  const hasNoBusinessUnits = hasFetched && total === 0;

  useEffect(() => {
    async function fetchDataAndSetOptions() {
      await dispatch(fetchBusinessUnits({ clientId: organizationId, contractorId }));

      const businessUnits = businessUnitsSelectors.selectAll(store.getState());

      if (businessUnits.length) {
        setOptions(
          businessUnits.map(({ businessUnitId, businessUnitName }) => ({
            value: businessUnitId,
            label: businessUnitName
          }))
        );
      } else {
        setOptions([{ value: 'none', label: 'None Assigned' }]);
      }
    }

    fetchDataAndSetOptions();
  }, [dispatch, organizationId, contractorId]);

  useEffect(() => {
    if (!isFetching && total <= 1 && options.length) {
      form.change('businessUnitId', options[0].value);
    } else {
      form.change('businessUnitId');
      form.resetFieldState('businessUnitId');
    }
  }, [total, options, contractorId, form, isFetching]);

  return (
    <Field<string>
      label="Business Unit"
      name="businessUnitId"
      variant="filled"
      component={SelectField}
      disabled={hasNoBusinessUnits}
      required={!hasNoBusinessUnits}
      validate={!hasNoBusinessUnits ? required : undefined}
      inputProps={{ 'data-testid': 'businessUnitId' }}
      fullWidth
    >
      {isFetching ? (
        <MenuItem>
          <Loading />
        </MenuItem>
      ) : error ? (
        <MenuItem>
          <Error />
        </MenuItem>
      ) : (
        options.map(({ label, value }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))
      )}
    </Field>
  );
};
