import * as React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Autocomplete, OwnProps as FieldArrayCustomProps } from '@pec/aion-ui-deprecated/components/Autocomplete';
import { AutocompleteDialog } from '@pec/aion-ui-deprecated/components/Autocomplete/Dialog';
import { DateField } from '@pec/aion-ui-deprecated/components/DateField';
import { DeepReadonly } from 'utility-types';
import { ExportReportContainer } from 'containers/ExportReport';
import { FieldArray, GenericFieldArray } from 'redux-form';
import { filterByName } from '@pec/aion-ui-core/helpers/autocomplete';
import { Form, InjectedFormProps, reduxForm } from 'redux-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAutocompleteOption } from '@pec/aion-ui-core/interfaces/autocompleteOption';
import { IReportForm } from 'interfaces/reportForm';
import { ISite } from 'interfaces/site';
import { ISiteTag } from 'interfaces/siteTag';
import { parseEndDate, parseStartDate } from '@pec/aion-ui-core/parsers';
import { ReportTableContainer } from 'containers/ReportTable';
import { Search } from 'history';
import { validateDateRange } from '@pec/aion-ui-core/validators';
import { useTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  sites: DeepReadonly<ISite[]>;
  siteTags: DeepReadonly<ISiteTag[]>;
  selectedSitesLength: number;
  selectedTagsLength: number;
  search: Search;
};

type Props = InjectedFormProps<IReportForm, OwnProps> & OwnProps;

const ReportForm: React.FC<Props> = ({
  submitting,
  handleSubmit,
  pristine,
  invalid,
  sites,
  siteTags,
  selectedSitesLength,
  selectedTagsLength,
  search
}) => {
  const { t } = useTranslation();
  const FieldArrayCustom = FieldArray as new () => GenericFieldArray<IAutocompleteOption, FieldArrayCustomProps>;

  return (
    <Form onSubmit={handleSubmit}>
      <GridContainer alignItems="flex-start" justify="space-between">
        <Grid item xs={6} sm={2}>
          <DateField name="start" label={t('smart.reportForm.startDate', 'Start Date')} parse={parseStartDate} />
        </Grid>
        <Grid item xs={6} sm={2}>
          <DateField name="end" label={t('smart.reportForm.endDate', 'End Date')} parse={parseEndDate} />
        </Grid>
        <Grid item xs={6} sm={2}>
          <AutocompleteDialog
            buttonText={
              selectedSitesLength === 0
                ? t('smart.reportForm.allSites', 'All Sites')
                : t('smart.reportForm.sitesCount', {
                    count: selectedSitesLength,
                    defaultValue_plural: '{{count}} Sites',
                    defaultValue: '{{count}} Site'
                  }).replace(selectedSitesLength.toString(), localizeNumber(selectedSitesLength, t))
            }
          >
            <FieldArrayCustom
              name="sites"
              component={Autocomplete}
              props={{
                label: t('smart.common.sites', 'Sites'),
                options: sites,
                placeholder: t('smart.reportForm.enterSiteName', 'Enter a Site Name…'),
                filter: filterByName
              }}
            />
          </AutocompleteDialog>
        </Grid>
        <Grid item xs={6} sm={2}>
          <AutocompleteDialog
            buttonText={
              selectedTagsLength === 0
                ? t('smart.reportForm.allTags', 'All Tags')
                : t('smart.reportForm.tagsCount', {
                    count: selectedTagsLength,
                    defaultValue_plural: '{{count}} Tags',
                    defaultValue: '{{count}} Tag'
                  }).replace(selectedTagsLength.toString(), localizeNumber(selectedTagsLength, t))
            }
          >
            <FieldArrayCustom
              name="tags"
              props={{
                label: t('smart.common.tags', 'Tags'),
                options: siteTags,
                placeholder: t('smart.reportForm.enterTag', 'Enter a Tag…'),
                filter: filterByName
              }}
              component={Autocomplete}
            />
          </AutocompleteDialog>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={submitting || pristine || invalid}
          >
            {t('smart.common.apply', 'Apply')}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <ExportReportContainer />
        </Grid>
      </GridContainer>
      {search && <ReportTableContainer submitting={submitting} />}
    </Form>
  );
};

export const ReportFormComponent = reduxForm<IReportForm, OwnProps>({
  enableReinitialize: true,
  form: 'reportForm',
  validate: validateDateRange
})(ReportForm);
