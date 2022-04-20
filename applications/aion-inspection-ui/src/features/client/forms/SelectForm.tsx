import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect } from 'react';
import { Error } from '@pec/aion-ui-components/components/Error';
import { fetchForms, formsSelectors } from 'features/client/forms/slice';
import { Field } from 'react-final-form';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { required } from '@pec/aion-ui-core/validators';
import { SelectField } from '@pec/aion-ui-form/components/SelectField';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';

export const SelectForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { organizationId } = useParams<{ organizationId: string }>();
  const { isFetching, error } = useTypedSelector(state => state.forms);
  const forms = useTypedSelector(formsSelectors.selectAll);
  const options = forms.map(({ id, name }) => ({ value: id, label: name }));

  useEffect(() => {
    dispatch(fetchForms(organizationId));
  }, [dispatch, organizationId]);

  return (
    <Field<string>
      label="Evaluation Protocol"
      name="formId"
      variant="filled"
      component={SelectField}
      required
      validate={required}
      fullWidth
    >
      {isFetching ? (
        <Loading />
      ) : error ? (
        <Error />
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
