import React, { useEffect, useState } from 'react';
import { AsyncAutocomplete } from 'common/components/AsyncAutocomplete';
import { contractorsSelectors, fetchContractors } from 'features/client/contractors/slice';
import { IInspectionForm } from 'interfaces/inspection';
import { Option } from '@pec/aion-ui-form/types/autocompleteOption';
import { required } from '@pec/aion-ui-core/validators';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useForm } from 'react-final-form';
import { useParams } from 'react-router-dom';

export const AutocompleteContractors: React.FC = () => {
  const dispatch = useAppDispatch();
  const form = useForm<IInspectionForm>();

  const { organizationId } = useParams<{ organizationId: string }>();
  const [searchTerm, setSearchTerm] = useState<string>();
  const { isFetching, error, total } = useTypedSelector(state => state.contractors);
  const contractors = useTypedSelector(contractorsSelectors.selectAll);
  const options = contractors.map(({ id, name }) => ({ value: id, label: name }));

  useEffect(() => {
    dispatch(fetchContractors({ organizationId, searchTerm }));
  }, [dispatch, organizationId, searchTerm]);

  const customOnChange = async (contractor: Option | null) => {
    if (!contractor) {
      form.reset();
    }
  };

  return (
    <AsyncAutocomplete
      label="Contractor"
      name="contractorId"
      options={options}
      isFetching={isFetching}
      error={error}
      total={total}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      customOnChange={customOnChange}
      fieldProps={{ validate: required }}
      textFieldProps={{ required: true }}
    />
  );
};
