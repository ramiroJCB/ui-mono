import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React, { useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { addScoreItem, fetchAnswers, fetchQuestions, fetchScoreItem, updateScoreItem } from './slice';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Grid, Button } from '@material-ui/core';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IScoreItem } from 'interfaces/scoreItem';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { ScoreItemCriteria } from './ScoreItemCriteria';
import * as yup from 'yup';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams, Link, useLocation, useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { QuestionType } from 'interfaces/questionType';
import { fetchScoreSet } from 'features/scoreSets/slice';

const schema = yup.object().shape({
  name: yup
    .string()
    .required()
    .label(' '),
  totalPointsAvailable: yup
    .number()
    .required()
    .integer()
    .moreThan(-1, 'Must be a whole number greater than or equal to 0')
    .typeError('Points must be a number'),
  scoreTypeId: yup
    .string()
    .required()
    .label(' '),
  questionSectionId: yup
    .string()
    .required()
    .label(' '),
  questionId: yup
    .string()
    .required()
    .label(' '),
  answerValues: yup
    .array()
    .required()
    .min(1, 'At least 1 answer is required')
});

const useStyles = makeStyles((theme: Theme) => ({
  buttonContainer: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(1.5)
  }
}));

type RouteParams = {
  organizationId: string;
  serviceRegionId: string;
  scoreSetId: string;
  scoreItemId?: string;
};

type IScoreItemForm = {
  name: string;
  isActive: boolean;
  totalPointsAvailable: number;
  questionType: QuestionType;
  questionSectionId: string;
  questionId: string;
  answerValues: string[];
  scoreSetId: string;
  scoreTypeId: string;
  questionAntithesis: boolean | null;
  awardOnAnyListedCheckboxChoice: boolean;
};

export const ScoreItemForm: React.FC = () => {
  const classes = useStyles();
  const { organizationId, serviceRegionId, scoreSetId, scoreItemId } = useParams<RouteParams>();
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const history = useHistory();
  const { expanded = '' } = parse(search);
  const { scoreItem, error, isFetching, isSubmitting } = useTypedSelector(state => state.scoreItem);
  const returnUrl = `/${organizationId}/scoring/service-regions/${serviceRegionId}/score-set/${scoreSetId}/edit?expanded=${expanded ||
    serviceRegionId}`;

  const methods = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty, isValid, errors },
    reset
  } = methods;

  useEffect(() => {
    if (scoreItemId) {
      dispatch(fetchScoreItem({ scoreSetId, scoreItemId }));
    }
  }, [dispatch, scoreSetId, scoreItemId]);

  useEffect(() => {
    if (scoreSetId) {
      dispatch(fetchScoreSet(scoreSetId));
    }
  }, [dispatch, scoreSetId]);

  useEffect(() => {
    if (scoreItem !== null && scoreItemId) {
      reset({
        name: scoreItem.name,
        isActive: scoreItem.isActive,
        questionType: scoreItem.questionType,
        totalPointsAvailable: scoreItem.totalPointsAvailable,
        questionSectionId: scoreItem.questionSectionId,
        questionId: scoreItem.questionId,
        scoreTypeId: scoreItem.scoreTypeId,
        answerValues: JSON.parse(scoreItem.answerValues).ids,
        awardOnAnyListedCheckboxChoice: scoreItem.awardOnAnyListedCheckboxChoice
      });
      dispatch(fetchQuestions(scoreItem.questionSectionId));
      dispatch(fetchAnswers(scoreItem.questionId));
    }
  }, [dispatch, scoreItem, scoreItemId, reset]);

  const onSubmit = async (values: IScoreItemForm) =>
    new Promise<void>(async (resolve, reject) => {
      try {
        const {
          name,
          isActive,
          totalPointsAvailable,
          questionType,
          questionSectionId,
          questionId,
          scoreTypeId,
          answerValues,
          awardOnAnyListedCheckboxChoice
        } = values;
        const stringifiedAnswers = JSON.stringify({ ids: answerValues });

        if (scoreItemId) {
          await dispatch(
            updateScoreItem({
              id: scoreItemId,
              name,
              isActive,
              totalPointsAvailable,
              questionType: questionType,
              questionSectionId,
              questionId,
              answerValues: stringifiedAnswers,
              scoreSetId,
              scoreTypeId,
              questionAntithesis: false,
              awardOnAnyListedCheckboxChoice
            })
          );
        } else {
          const result = await dispatch(
            addScoreItem({
              name,
              isActive,
              totalPointsAvailable,
              questionType: questionType,
              questionSectionId,
              questionId,
              answerValues: stringifiedAnswers,
              scoreSetId,
              scoreTypeId,
              questionAntithesis: false,
              awardOnAnyListedCheckboxChoice
            })
          );
          result.payload &&
            history.replace(
              `/${organizationId}/scoring/service-regions/${serviceRegionId}/score-set/${scoreSetId}/score-item/${
                (result.payload as IScoreItem).id
              }/edit?expanded=${expanded}`
            );
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    });

  return (
    <FormProvider {...methods}>
      <Grid item xs={12}>
        <Paper hasError={!!error} isLoading={isFetching || isSubmitting}>
          <Box p={1}>
            <form style={{ display: 'inherit' }} onSubmit={handleSubmit(onSubmit)}>
              <GridContainer>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    {scoreItemId ? 'Edit' : 'Add'} Scoring Item
                  </Typography>
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  <Controller
                    name="isActive"
                    control={control}
                    defaultValue={false}
                    render={({ onChange, value }) => (
                      <FormControlLabel
                        control={<Switch checked={value} onChange={e => onChange(e.target.checked)} color="primary" />}
                        label="Activate Scoring Item"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={4} direction="column">
                    <Grid item xs={12}>
                      <TextField
                        label="Score Item Name"
                        name="name"
                        autoFocus
                        defaultValue=""
                        variant="filled"
                        fullWidth
                        required
                        InputLabelProps={{
                          shrink: true
                        }}
                        inputRef={register}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Total Points Available"
                        name="totalPointsAvailable"
                        type="number"
                        variant="filled"
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                        required
                        inputRef={register}
                        error={!!errors.totalPointsAvailable}
                        helperText={errors.totalPointsAvailable?.message}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <ScoreItemCriteria />
                <Grid container spacing={3} className={classes.buttonContainer}>
                  <Grid item>
                    <Button variant="contained" color="primary" type="submit" disabled={!isDirty || !isValid}>
                      Submit
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button color="primary" component={Link} to={returnUrl}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </GridContainer>
            </form>
          </Box>
        </Paper>
      </Grid>
    </FormProvider>
  );
};
