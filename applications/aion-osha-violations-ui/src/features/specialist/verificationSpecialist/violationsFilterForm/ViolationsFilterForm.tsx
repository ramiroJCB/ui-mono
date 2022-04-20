import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import { Button } from '@material-ui/core';
import { CurrentStatus } from 'interfaces/oshaViolations';
import { Field, Form } from 'react-final-form';
import { IViolationsFilters } from 'interfaces/violationsFilters';
import { LoadingButton } from '@pec/aion-ui-components/components/LoadingButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { merge, parse } from '@pec/aion-ui-core/helpers/querystring';
import { SelectState } from 'common/components/SelectState';
import { TextField } from '@pec/aion-ui-form/components/TextField';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useTypedSelector } from 'app/reducer';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme: Theme) => ({
  adornment: {
    color: theme.palette.grey[500]
  },
  root: {
    padding: 10
  },
  buttons: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px'
  }
}));

type Props = {
  initialValues: IViolationsFilters;
};

export const ViolationsFilterForm: React.FC<Props> = ({ initialValues }: Props) => {
  const { status } = useParams<{ status: CurrentStatus }>();
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();

  const { isFetching: isFetchingUnMatched } = useTypedSelector(state => state.unMatchedViolations);
  const { isFetching: isFetchingAssociated } = useTypedSelector(state => state.associatedViolations);
  const { isFetching: isFetchingPending } = useTypedSelector(state => state.pendingViolations);
  const { isFetching: isFetchingUnassociated } = useTypedSelector(state => state.unassociatedViolations);

  const isFetching = isFetchingUnassociated || isFetchingUnMatched || isFetchingAssociated || isFetchingPending;

  const onSubmit = (values: IViolationsFilters): void => {
    const { state, keyword, activity, automaticMatches } = values;

    const {
      location: { search }
    } = history;

    const { orderBy, order } = parse(search);

    history.push({
      search: merge('', {
        state: state ? state.value : '',
        keyword: keyword ? keyword : '',
        activity: activity ? activity : '',
        matchType: automaticMatches ? 'Automatic' : '',
        orderBy: orderBy ? orderBy : '',
        order: order ? order : ''
      })
    });
  };

  const isDisabled = (values: IViolationsFilters): boolean => Object.keys(values).some(key => values[key]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form, values }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} direction={'column'}>
            <Grid item xs={12}>
              <Field<string>
                name="keyword"
                component={TextField}
                fullWidth
                variant="filled"
                placeholder={t('oshaViolations.violationsFilterForm.searchCompanyOrSsqid', 'Search Company or SSQID')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon className={classes.adornment} />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Field name="state" variant="filled" component={SelectState} />
            </Grid>
            <Grid item xs={12}>
              <Field<string>
                fullWidth
                name="activity"
                label={t('oshaViolations.common.activity', 'Activity')}
                component={TextField}
                variant="filled"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="automaticMatches"
                type="checkbox"
                component={({ input }) => (
                  <FormControlLabel
                    control={
                      <Checkbox color="default" {...input} inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
                    }
                    label={t('oshaViolations.violationsFilterForm.hideAutomaticMatches', 'Hide Automatic Matches')}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                name="attestations"
                type="checkbox"
                component={({ input }) => (
                  <FormControlLabel
                    name="attestations"
                    control={
                      <Checkbox {...input} color="default" inputProps={{ 'aria-label': 'uncontrolled-checkbox' }} />
                    }
                    label={t('oshaViolations.violationsFilterForm.hideAttestedCitations', 'Hide Attested Citations')}
                  />
                )}
              />
            </Grid>
            <Grid direction={'row'} className={classes.buttons}>
              <Grid item xs={4}>
                <LoadingButton fullWidth type="submit" variant="contained" color="primary" disabled={isFetching}>
                  {isFetching ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    t('oshaViolations.common.apply', 'Apply')
                  )}
                </LoadingButton>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  type="reset"
                  disabled={!isDisabled(values)}
                  onClick={() => {
                    form.reset();
                    history.push(status ? `/osha-violations/${status}` : '/osha-violations');
                  }}
                >
                  {t('oshaViolations.common.clear', 'Clear')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    />
  );
};
