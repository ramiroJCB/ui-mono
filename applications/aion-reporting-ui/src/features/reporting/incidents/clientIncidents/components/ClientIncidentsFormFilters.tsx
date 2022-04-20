import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import { Autocomplete, OwnProps as FieldArrayCustomProps } from '@pec/aion-ui-deprecated/components/Autocomplete';
import { AutocompleteContractorsContainer } from 'features/autocompleteContractors/containers/AutocompleteContractors';
import { AutocompleteDialog } from '@pec/aion-ui-deprecated/components/Autocomplete/Dialog';
import { DateField } from '@pec/aion-ui-deprecated/components/DateField';
import { DeepReadonly } from 'utility-types';
import { FieldArray, GenericFieldArray } from 'redux-form';
import { filterByName } from '@pec/aion-ui-core/helpers/autocomplete';
import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';
import { IIncidentCategory } from 'interfaces/incidentCategory';
import { IIncidentType } from 'interfaces/incidentType';
import { parseEndDate, parseStartDate } from '@pec/aion-ui-core/parsers';
import { ReportType } from 'features/redirect/enums/reportType';
import { TextFieldProps } from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';

type Props = {
  organizationId: string;
  incidentTypes: DeepReadonly<IIncidentType[]> | null;
  incidentCategories: DeepReadonly<IIncidentCategory[]> | null;
  selectedContractorsLength: number;
  selectedTypesLength: number;
  selectedCategoriesLength: number;
};

const FieldArrayCustom = FieldArray as new () => GenericFieldArray<
  IAutocompleteOption,
  FieldArrayCustomProps & Omit<TextFieldProps, 'component' | 'classes'>
>;

export const ClientIncidentsFormFiltersComponent: React.FC<Props> = ({
  organizationId,
  incidentTypes,
  incidentCategories,
  selectedContractorsLength,
  selectedTypesLength,
  selectedCategoriesLength
}) => {
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <Grid item>
        <DateField
          name="start"
          label={t('reporting.incidents.clientIncidents.startDate', 'Start Date')}
          parse={parseStartDate}
        />
      </Grid>
      <Grid item>
        <DateField
          name="end"
          label={t('reporting.incidents.clientIncidents.endDate', 'End Date')}
          parse={parseEndDate}
        />
      </Grid>
      <Grid item>
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
          <AutocompleteContractorsContainer organizationId={organizationId} reportType={ReportType.Incidents} />
        </AutocompleteDialog>
      </Grid>
      {incidentTypes && (
        <Grid item>
          <AutocompleteDialog
            buttonText={
              selectedTypesLength === 0
                ? t('reporting.incidents.clientIncidents.allCategories', 'All Behavior Categories')
                : t('reporting.incidents.clientIncidents.categoriesCount', {
                    count: selectedTypesLength,
                    defaultValue_plural: '{{count}} Behavior Categories',
                    defaultValue: '{{count}} Behavior Category'
                  })
            }
          >
            <FieldArrayCustom
              name="types"
              props={{
                autoFocus: true,
                label: t('reporting.common.behaviorCategories', 'Behavior Categories'),
                options: incidentTypes,
                placeholder: t(
                  'reporting.incidents.clientIncidents.enterBehaviorCategoryName',
                  'Enter a Behavior Category Name…'
                ),
                filter: filterByName
              }}
              component={Autocomplete}
            />
          </AutocompleteDialog>
        </Grid>
      )}
      {incidentCategories && (
        <Grid item>
          <AutocompleteDialog
            buttonText={
              selectedCategoriesLength === 0
                ? t('reporting.incidents.clientIncidents.allClassifications', 'All Classifications')
                : t('reporting.incidents.clientIncidents.classificationsCount', {
                    count: selectedCategoriesLength,
                    defaultValue_plural: '{{count}} Classifications',
                    defaultValue: '{{count}} Classification'
                  })
            }
          >
            <FieldArrayCustom
              name="categories"
              props={{
                autoFocus: true,
                label: t('reporting.common.classifications', 'Classifications'),
                options: incidentCategories,
                placeholder: t(
                  'reporting.incidents.clientIncidents.enterClassificationName',
                  'Enter a Classification Name…'
                ),
                filter: filterByName
              }}
              component={Autocomplete}
            />
          </AutocompleteDialog>
        </Grid>
      )}
    </React.Fragment>
  );
};
