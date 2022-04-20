import * as React from 'react';
import { AutocompleteCreators } from './AutocompleteCreators';
import { AxiosError } from 'axios';
import { DeepReadonly } from 'utility-types';
import { IReservationsUser } from '@pec/aion-ui-core/interfaces/reservation';
import { useTranslation } from 'react-i18next';

type Props = {
  filters: DeepReadonly<{
    creators: IReservationsUser[];
  }>;
  creators: DeepReadonly<{
    isFetching: boolean;
    creators: IReservationsUser[] | null;
    total: number | null;
    error: AxiosError | null;
  }>;
  handleSelect: (param: keyof Props['filters']) => (ids: string) => void;
  handleSearch: (param: keyof Props['filters']) => (searchTerm: string) => void;
};

export const FiltersComponent: React.FC<Props> = ({ filters, creators, handleSelect, handleSearch }) => {
  const { t } = useTranslation();

  return (
    <AutocompleteCreators
      options={creators.creators?.map(({ userId, fullName }) => ({ value: userId, label: fullName }))}
      defaultValue={filters.creators?.map(({ userId, fullName }) => ({ value: userId, label: fullName }))}
      label={t('classes.filters.createdBy', 'Created By')}
      loading={creators.isFetching}
      hasError={Boolean(creators.error)}
      total={creators.total || 0}
      handleSelect={handleSelect('creators')}
      handleSearch={handleSearch('creators')}
    />
  );
};
