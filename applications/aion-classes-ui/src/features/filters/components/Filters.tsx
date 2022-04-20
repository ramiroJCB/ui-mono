import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import { AxiosError } from 'axios';
import { debounce } from 'lodash';
import { DeepReadonly } from 'utility-types';
import { FiltersAutocomplete } from './Autocomplete';
import { FiltersChecklist } from '@pec/aion-ui-components/components/Checklist';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { ITrainingProgram } from '@pec/aion-ui-core/interfaces/trainingProgram';
import { ITrainingProvider } from '@pec/aion-ui-core/interfaces/trainingProvider';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Moment } from 'moment';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { TrainingClassLanguage } from '@pec/aion-ui-core/interfaces/trainingClass';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { localizeDate } from '@pec/aion-ui-i18next/helpers/localize';

const { English, French, Spanish, Vietnamese } = TrainingClassLanguage;

const styles = (theme: Theme) => ({
  divided: {
    borderTop: `1px solid ${theme.palette.divider}`
  }
});

type OwnProps = {
  open: boolean;
  includeAllBasicCourses: string;
  startDate: string;
  supportedLanguages: string;
  filters: DeepReadonly<{
    programs: ITrainingProgram[];
    providers: ITrainingProvider[];
  }>;
  programs: DeepReadonly<{
    isFetching: boolean;
    programs: ITrainingProgram[] | null;
    basicPrograms: ITrainingProgram[] | null;
    total: number | null;
    error: AxiosError | null;
  }>;
  providers: DeepReadonly<{
    isFetching: boolean;
    providers: ITrainingProvider[] | null;
    total: number | null;
    error: AxiosError | null;
  }>;
  handleDateFilter: (property: string, value: string) => void;
  handleSelect: (param: keyof Props['filters'] | 'supportedLanguages') => (ids: string) => void;
  handleSelectBasicPrograms: (value: string) => void;
  handleSearch: (param: keyof Props['filters']) => (searchTerm: string) => void;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

class Component extends React.PureComponent<Props> {
  updateDateFilter = (momentDate: Moment) => {
    if (momentDate === null) {
      this.props.handleDateFilter('startDate', '');
    } else if (momentDate.isValid()) {
      this.debounceUpdateFilter('startDate', momentDate.format('YYYY-MM-DD'));
    }
  };

  debounceUpdateFilter = debounce((id: string, value: string) => {
    this.props.handleDateFilter(id, value);
  }, 500);

  render() {
    const {
      classes,
      filters,
      includeAllBasicCourses,
      open,
      programs,
      providers,
      startDate,
      supportedLanguages,
      handleSelect,
      handleSelectBasicPrograms,
      handleSearch,
      t
    } = this.props;
    return (
      <GridContainer>
        <Grid item xs={12} className={classes.divided}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              name="startDate"
              label={t('classes.common.startDate', 'Start Date')}
              onChange={this.updateDateFilter}
              value={startDate || null}
              format={localizeDate(startDate, t)}
              fullWidth
              clearable
              disablePast
              inputVariant="filled"
              minDateMessage={<span>{t('classes.filters.minDateMessage', 'Date cannot be in the past')}</span>}
              KeyboardButtonProps={{
                'aria-label': t('classes.common.changeDate', 'change date')
              }}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12}>
          <FiltersAutocomplete
            open={open}
            options={programs.programs?.map(({ id, name }) => ({ value: id, label: name }))}
            defaultValue={filters.programs?.map(({ id, name }) => ({ value: id, label: name }))}
            label={t('classes.filters.courses', 'Courses')}
            loading={programs.isFetching}
            hasError={Boolean(programs.error)}
            total={programs.total || 0}
            handleSelect={handleSelect('programs')}
            handleSearch={handleSearch('programs')}
          />
          <FiltersChecklist
            values={includeAllBasicCourses}
            handleSelect={handleSelectBasicPrograms}
            options={[
              {
                value: 'true',
                label: t('classes.filters.basicCourses', 'All Basic Courses')
              }
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <FiltersAutocomplete
            open={open}
            options={providers.providers?.map(({ id, name }) => ({ value: id, label: name }))}
            defaultValue={filters.providers?.map(({ id, name }) => ({ value: id, label: name }))}
            label={t('classes.filters.trainingProviders', 'Training Providers')}
            loading={providers.isFetching}
            hasError={Boolean(providers.error)}
            total={providers.total || 0}
            handleSelect={handleSelect('providers')}
            handleSearch={handleSearch('providers')}
          />
        </Grid>
        <Grid item xs={12}>
          <FiltersChecklist
            values={supportedLanguages}
            legendText={t('classes.filters.supportedLanguages', 'Supported Languages')}
            handleSelect={handleSelect('supportedLanguages')}
            options={[English, French, Spanish, Vietnamese].map(language => ({
              value: language,
              label: language
            }))}
          />
        </Grid>
      </GridContainer>
    );
  }
}

export const FiltersComponent = withStyles(styles)(withTranslation()(Component));
