import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Field, Form } from 'react-final-form';
import { FiltersDrawer } from '@pec/aion-ui-components/components/FiltersDrawer';
import { FormApi } from 'final-form';
import { ISearchContractorsForm } from 'interfaces/searchContractorsForm';
import { ISearchFilters } from 'interfaces/searchFilters';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { required } from '@pec/aion-ui-core/validators';
import { SearchFiltersComponent } from './SearchFilters';
import { SelectField } from '@pec/aion-ui-form/components/Autocomplete/SelectField';
import { SelectState } from 'components/SelectState';
import { TextField } from '@pec/aion-ui-form/components/TextField';

export const distances = [
  { value: 10, label: '10 miles' },
  { value: 20, label: '20 miles' },
  { value: 50, label: '50 miles' },
  { value: 100, label: '100 miles' },
  { value: 500, label: '500 miles' },
  { value: '', label: '> 500 miles' }
];

const styles = (theme: Theme) =>
  createStyles({
    button: {
      padding: theme.spacing(2)
    },
    resultsText: {
      margin: `${theme.spacing(1)}px ${theme.spacing(2)}px`
    },
    label: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      right: 0
    }
  });

type OwnProps = {
  returnValues: ISearchContractorsForm;
  totalCount: number;
  initialValues: ISearchContractorsForm;
  onSubmit: (values: ISearchContractorsForm, form: FormApi<ISearchContractorsForm>) => Promise<void>;
  searchFilters: DeepReadonly<ISearchFilters> | null;
  isFiltered: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

class SearchContractorsForm extends React.Component<Props> {
  apply = (values: ISearchContractorsForm, form: FormApi<ISearchContractorsForm>) => () =>
    this.props.onSubmit(values, form);

  clear = (form: FormApi<ISearchContractorsForm>) => () => {
    const filters = form.getState().values.filters;
    filters && Object.keys(filters).map(filter => form.change(`filters.${filter}`, ''));
  };

  render() {
    const {
      totalCount,
      initialValues,
      onSubmit,
      classes,
      returnValues: { keyword, city, state, distance },
      searchFilters,
      isFiltered
    } = this.props;

    return (
      <Form initialValues={initialValues} onSubmit={onSubmit}>
        {({ handleSubmit, submitting, invalid, pristine }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={3}>
                <Field<string>
                  name="keyword"
                  label="Name, Work Type, Service or NAICS Code"
                  component={TextField}
                  fullWidth
                  variant="filled"
                  required
                  validate={required}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                  InputLabelProps={{ classes: { root: classes.label } }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={2}>
                <Field<string>
                  name="city"
                  label="City"
                  required
                  validate={required}
                  component={TextField}
                  fullWidth
                  variant="filled"
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={3}>
                <Field name="state" validate={required} variant="filled">
                  {props => <SelectState {...props} />}
                </Field>
              </Grid>
              <Grid item xs={12} lg={3}>
                <Field name="distance" validate={required}>
                  {props => (
                    <SelectField
                      id="distance"
                      label="Distance"
                      menuPosition="fixed"
                      maxMenuHeight={200}
                      isClearable
                      allowNull
                      variant="filled"
                      options={distances}
                      required
                      {...props}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} lg={1}>
                <LoadingButton
                  fullWidth
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  color={pristine || invalid ? 'primary' : 'secondary'}
                  isSubmitting={submitting}
                  disabled={submitting}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </LoadingButton>
              </Grid>
              {keyword && distance && city && state && (
                <Grid item xs={12}>
                  <Grid container>
                    <Grid item>
                      <Typography
                        className={classes.resultsText}
                        variant="body1"
                      >{`${totalCount.toLocaleString()} Results for "${keyword}" within ${
                        distance.value ? distance.value : 'more than 500'
                      } miles of ${city}, ${state.value}`}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={2}>
                      <FiltersDrawer isFiltered={isFiltered}>
                        <SearchFiltersComponent onSubmit={onSubmit} searchFilters={searchFilters} />
                      </FiltersDrawer>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Form>
    );
  }
}

export const SearchContractorsFormComponent = withStyles(styles)(SearchContractorsForm);
