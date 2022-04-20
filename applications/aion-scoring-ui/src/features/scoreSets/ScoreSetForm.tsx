import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import React, { useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { addScoreSet, fetchExistingScoreItems, fetchExistingScoreSets, fetchScoreSet, updateScoreSet } from './slice';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IServiceListItem } from 'interfaces/scoreSetService';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { Controller, useForm } from 'react-hook-form';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useHistory, useParams, Link, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { ServicesList } from './ServicesList';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { ScoreItemTable } from 'features/scoreItems/ScoreItemTable';

const schema = yup.object().shape({
  name: yup
    .string()
    .required()
    .label(' ')
});

const useStyles = makeStyles((theme: Theme) => ({
  scoreItemsContainer: {
    marginTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`
  }
}));

type RouteParams = {
  organizationId: string;
  serviceRegionId: string;
  scoreSetId?: string;
};

type IScoreSetForm = {
  name: string;
  isActive: boolean;
  scoreSetServices: IServiceListItem[];
};

export const ScoreSetForm: React.FC = () => {
  const classes = useStyles();
  const { organizationId, serviceRegionId, scoreSetId } = useParams<RouteParams>();
  const { isFetching, error, isSubmitting, scoreSet, scoreSets, scoreSetServices } = useTypedSelector(
    state => state.scoreSet
  );
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  const { expanded = '' } = parse(search);
  const returnUrl = `/${organizationId}/scoring/service-regions?expanded=${expanded || serviceRegionId}`;
  const isEdittingScoreSet = useLocation()?.pathname.includes('edit');

  const {
    register,
    handleSubmit,
    errors,
    control,
    formState: { isDirty, isValid },
    reset
  } = useForm({
    resolver: yupResolver(
      schema.test(
        'name',
        'A score set with this name already exists',
        values =>
          !scoreSets
            ?.filter(({ id }) => id !== scoreSetId)
            .some(({ name }) => name.toLowerCase() === values.name?.toLowerCase())
      )
    ),
    mode: 'onChange'
  });

  useEffect(() => {
    scoreSets === null && dispatch(fetchExistingScoreSets({ serviceRegionId, clientId: organizationId }));
  }, [dispatch, scoreSets, serviceRegionId, organizationId]);

  useEffect(() => {
    if (scoreSetId) {
      dispatch(fetchExistingScoreItems(scoreSetId));
      dispatch(fetchScoreSet(scoreSetId));
    }
  }, [dispatch, scoreSetId]);

  useEffect(() => {
    if (scoreSet !== null && scoreSetId && scoreSetServices) {
      reset({
        name: scoreSet.name,
        isActive: scoreSet.isActive,
        scoreSetServices: scoreSetServices?.map(({ serviceId, name }) => {
          return { id: serviceId, name };
        })
      });
    }
  }, [scoreSet, scoreSetId, reset, scoreSetServices]);

  const onSubmit = async (values: IScoreSetForm) =>
    new Promise<void>(async (resolve, reject) => {
      try {
        const { name, isActive, scoreSetServices } = values;
        if (scoreSetId && scoreSet) {
          const result = await dispatch(
            updateScoreSet({ scoreSet: { ...scoreSet, name, isActive }, scoreSetServices })
          );
          result.payload && history.push(returnUrl);
        } else {
          const result = await dispatch(
            addScoreSet({ scoreSet: { name, isActive, serviceRegionId, organizationId }, scoreSetServices })
          );
          result.payload && history.push(returnUrl);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });

  return (
    <Grid item xs={12}>
      <Paper hasError={!!error} isLoading={isFetching || isSubmitting || scoreSets === null}>
        <Box p={1}>
          <GridContainer>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                {scoreSetId ? 'Edit' : 'Add'} Scoring Set
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={3} direction="column">
                  <Grid item xs={12} lg={4}>
                    <TextField
                      label="Score Set Title"
                      name="name"
                      autoFocus
                      defaultValue=""
                      variant="filled"
                      fullWidth
                      inputRef={register}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      required
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={4}>
                    <Controller
                      name="isActive"
                      control={control}
                      defaultValue={false}
                      render={({ onChange, value }) => {
                        return (
                          <FormControlLabel
                            control={
                              <Switch checked={value} onChange={e => onChange(e.target.checked)} color="primary" />
                            }
                            label="Activate Scoring Set"
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      {t('scoring.scoreSetForm.selectServices', 'Available Services')}
                    </Typography>
                    <Controller
                      name="scoreSetServices"
                      control={control}
                      defaultValue={[]}
                      render={({ onChange, value }) => <ServicesList onChange={onChange} value={value} />}
                    />
                  </Grid>
                  <GridContainer spacing={3}>
                    <Grid item>
                      <Button variant="contained" color="primary" type="submit" disabled={!isDirty || !isValid}>
                        {scoreSetId ? 'Save' : 'Submit'}
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button color="primary" component={Link} to={returnUrl}>
                        Cancel
                      </Button>
                    </Grid>
                  </GridContainer>
                </Grid>
              </form>
            </Grid>
          </GridContainer>
          {isEdittingScoreSet && (
            <GridContainer>
              <Grid item xs={12} className={classes.scoreItemsContainer}>
                <Typography variant="h6" gutterBottom>
                  Scoring Items
                </Typography>
              </Grid>
              {scoreSetId && <ScoreItemTable scoreSetId={scoreSetId} />}
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  component={Link}
                  to={`/${organizationId}/scoring/service-regions/${serviceRegionId}/score-set/${scoreSetId}/score-item/add?expanded=${expanded}`}
                >
                  Add Scoring Item
                </Button>
              </Grid>
            </GridContainer>
          )}
        </Box>
      </Paper>
    </Grid>
  );
};
