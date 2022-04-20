import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Field, Form } from 'react-final-form';
import { ISearchClassesForm } from 'interfaces/searchClassesForm';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { SelectField } from '@pec/aion-ui-form/components/Autocomplete/SelectField';
import { SelectState } from './SelectState';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';
import { required } from '@pec/aion-ui-core/validators';
import { useTranslation } from 'react-i18next';
import { IDistance } from 'interfaces/distance';

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
  distances: IDistance[];
  initialValues: ISearchClassesForm;
  isFetching: boolean;
  onSubmit: (values: ISearchClassesForm) => void;
  totalCount: number;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Component: React.FC<Props> = ({ classes, distances, initialValues, isFetching, onSubmit, totalCount }) => {
  const { city, state, distance } = initialValues;
  const { t } = useTranslation();

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit, submitting, invalid, pristine }) => (
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <Field<string>
                name="city"
                label={t('classes.classesList.searchClassesForm.city', 'City')}
                required
                validate={required}
                component={TextField}
                fullWidth
                variant="filled"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field name="state" validate={required} variant="filled">
                {props => <SelectState {...props} />}
              </Field>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Field name="distance" validate={required}>
                {props => {
                  const { value } = props.input.value;

                  props = {
                    ...props,
                    input: {
                      ...props.input,
                      value: value !== undefined && distances.find(item => item.value === value)
                    }
                  };

                  return (
                    <SelectField
                      id="distance"
                      label={t('classes.classesList.searchClassesForm.distance', 'Distance')}
                      menuPosition="fixed"
                      maxMenuHeight={200}
                      isClearable
                      allowNull
                      variant="filled"
                      options={distances}
                      required
                      {...props}
                    />
                  );
                }}
              </Field>
            </Grid>
            <Grid item xs={12} sm={3} lg={2}>
              <LoadingButton
                fullWidth
                className={classes.button}
                type="submit"
                variant="contained"
                color={pristine || invalid ? 'primary' : 'secondary'}
                isSubmitting={submitting}
                disabled={submitting}
              >
                {submitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t('classes.classesList.searchClassesForm.search', 'Search')
                )}
              </LoadingButton>
            </Grid>
            {!isFetching && distance && city && state && (
              <Grid item xs={12}>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.resultsText} variant="body1">
                      {t('classes.classesList.searchClassesForm.resultsText', {
                        city,
                        distance: distance.value
                          ? localizeNumber(distance.value, t)
                          : t('classes.classesList.searchClassesForm.moreThan', 'more than 500'),
                        state: state.value,
                        totalCount: localizeNumber(totalCount, t),
                        defaultValue: '{{totalCount}} Results within {{distance}} miles of {{city}}, {{state}}'
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </form>
      )}
    </Form>
  );
};

export const SearchClassesForm = withStyles(styles)(Component);
