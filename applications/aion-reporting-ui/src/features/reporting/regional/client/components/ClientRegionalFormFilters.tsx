import * as React from 'react';
import { AutocompleteContractorsContainer } from 'features/autocompleteContractors/containers/AutocompleteContractors';
import { AutocompleteDialog } from '@pec/aion-ui-deprecated/components/Autocomplete/Dialog';
import { ReportType } from 'features/redirect/enums/reportType';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  periodId: string;
  selectedContractorsLength: number;
};

export const ClientRegionalFormFiltersComponent: React.FC<Props> = ({
  organizationId,
  periodId,
  selectedContractorsLength
}) => {
  const { t } = useTranslation();

  return (
    <AutocompleteDialog
      buttonText={
        selectedContractorsLength === 0
          ? t('reporting.common.allContractors', 'All Contractors')
          : t('reporting.common.contractorsCount', {
              count: selectedContractorsLength,
              defaultValue_plural: '{{count}} Contractors',
              defaultValue: '{{count}} Contractor'
            })
      }
    >
      <AutocompleteContractorsContainer
        organizationId={organizationId}
        periodId={periodId}
        reportType={ReportType.Regional}
      />
    </AutocompleteDialog>
  );
};
