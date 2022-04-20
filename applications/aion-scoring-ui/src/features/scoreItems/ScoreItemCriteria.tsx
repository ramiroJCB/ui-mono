import CancelIcon from '@material-ui/icons/Cancel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import React, { useEffect } from 'react';
import Select from '@material-ui/core/Select';
import { Typography, Grid, Box, makeStyles, Chip, Checkbox, FormControl, InputLabel } from '@material-ui/core';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useParams } from 'react-router-dom';
import { fetchAnswers, fetchQuestions, fetchQuestionSections, fetchScoreTypes } from './slice';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Controller, useFormContext } from 'react-hook-form';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { QuestionType } from 'interfaces/questionType';

type RouteParams = {
  organizationId: string;
};

const useStyles = makeStyles(() => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  }
}));

export const ScoreItemCriteria: React.FC = () => {
  const classes = useStyles();
  const { organizationId } = useParams<RouteParams>();
  const dispatch = useAppDispatch();
  const { scoreTypes, questionSections, questions, answers, loadingCriteria } = useTypedSelector(
    state => state.scoreItem
  );
  const { control, watch, errors, reset, getValues } = useFormContext();
  const { questionType, questionId, questionSectionId, scoreTypeId } = watch([
    'questionType',
    'questionId',
    'questionSectionId',
    'scoreTypeId'
  ]);

  useEffect(() => {
    dispatch(fetchScoreTypes(null));
    dispatch(fetchQuestionSections(organizationId));
  }, [dispatch, organizationId]);

  const getAnswerName = (id: string) => (answers && answers.find(answer => answer.id === id)?.description) || 'N/A';

  const questionSectionNeeded = (id: string) => scoreTypes?.find(st => st.id === id)?.name === 'General Question';

  const onScoreTypeChange = (id: string) => {
    reset(
      {
        ...getValues(),
        questionSectionId: undefined,
        questionId: undefined,
        answerValues: undefined,
        questionType: questionSectionNeeded(id) ? QuestionType.Checkbox : QuestionType.NotSupported
      },
      { errors: true }
    );
  };

  const onQuestionSectionChange = (value: string) => {
    reset(
      {
        ...getValues(),
        questionId: undefined,
        answerValues: undefined
      },
      { errors: true }
    );
    dispatch(fetchQuestions(value));
  };

  const onQuestionChange = (value: string) => {
    const questionType = questions?.find(q => q.id === value)?.questionType || QuestionType.NotSupported;
    reset(
      {
        ...getValues(),
        questionType: questionType,
        answerValues: undefined
      },
      { errors: true }
    );
    dispatch(fetchAnswers(value));
  };

  const scoringError = (message: string) => (
    <GridContainer justify="center" alignItems="center">
      <Grid item>
        <Box m={2}>
          <Typography variant="h5" align="center" color="error">
            {message}
          </Typography>
        </Box>
      </Grid>
    </GridContainer>
  );

  return (
    <Grid item xs={12}>
      <Paper isLoading={loadingCriteria}>
        <GridContainer>
          <Grid item xs={12}>
            <Box mb={4}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Score Criteria
                </Typography>
              </Grid>
            </Box>
            {scoreTypes && (
              <Grid item xs={12}>
                <Box mb={3}>
                  <Controller
                    name="scoreTypeId"
                    control={control}
                    defaultValue=""
                    render={({ onChange, value }) => (
                      <FormControl fullWidth error={!!errors.scoreTypeId}>
                        <InputLabel id="scoreTypeId" shrink>
                          Type of Score *
                        </InputLabel>
                        <Select
                          labelId="scoreTypeId"
                          displayEmpty
                          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                            onChange(event.target.value);
                            onScoreTypeChange(event.target.value);
                          }}
                          value={value}
                        >
                          <MenuItem value="" disabled>
                            Select a Scoring Type
                          </MenuItem>
                          {scoreTypes.map(({ id, name }) => (
                            <MenuItem key={id} value={id}>
                              {name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.questionType && <FormHelperText>{errors.scoreTypeId?.message}</FormHelperText>}
                      </FormControl>
                    )}
                  />
                </Box>
              </Grid>
            )}
            {questionSectionNeeded(scoreTypeId) && (
              <>
                {questionSections && (
                  <Grid item xs={12}>
                    <Box mb={3}>
                      <Controller
                        name="questionSectionId"
                        control={control}
                        defaultValue=""
                        render={({ onChange, value }) => (
                          <FormControl fullWidth error={!!errors.questionSectionId}>
                            <InputLabel id="questionSection" shrink>
                              Question Section *
                            </InputLabel>
                            <Select
                              labelId="questionSection"
                              displayEmpty
                              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                onChange(event.target.value);
                                onQuestionSectionChange(event.target.value);
                              }}
                              value={value}
                            >
                              <MenuItem value="" disabled>
                                Select a Question Section
                              </MenuItem>
                              {questionSections.map(({ id, name }) => (
                                <MenuItem key={id} value={id}>
                                  {name}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.questionSectionId && (
                              <FormHelperText>{errors.questionSectionId?.message}</FormHelperText>
                            )}
                          </FormControl>
                        )}
                      />
                    </Box>
                  </Grid>
                )}
                {questions && questionSectionId && (
                  <Grid item xs={12}>
                    <Box mb={5}>
                      <Controller
                        name="questionId"
                        control={control}
                        defaultValue=""
                        render={({ onChange, value }) => (
                          <FormControl fullWidth error={!!errors.questionId}>
                            <InputLabel id="question" shrink>
                              Question *
                            </InputLabel>
                            <Select
                              labelId="question"
                              displayEmpty
                              onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                onChange(event.target.value);
                                onQuestionChange(event.target.value);
                              }}
                              value={value}
                            >
                              <MenuItem value="" disabled>
                                Select a Question
                              </MenuItem>
                              {questions.map(({ id, text }) => (
                                <MenuItem key={id} value={id}>
                                  {text}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.questionId && <FormHelperText>{errors.questionId?.message}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </Box>
                  </Grid>
                )}
                {answers && questionId && answers.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      Available Answers
                    </Typography>
                    <Grid item xs={12}>
                      <Controller
                        name="awardOnAnyListedCheckboxChoice"
                        control={control}
                        defaultValue={false}
                        render={({ onChange, value }) => (
                          <FormControlLabel
                            control={
                              <Checkbox checked={value} color="primary" onChange={e => onChange(e.target.checked)} />
                            }
                            label="Check here to award score if any one of the answers below is provided by the contractor. Otherwise all answers must be provided to award score."
                          />
                        )}
                      />
                    </Grid>
                    <Box mb={3} mt={2}>
                      <Controller
                        name="answerValues"
                        control={control}
                        defaultValue={[]}
                        render={({ onChange, value }) => (
                          <FormControl fullWidth error={!!errors.answerValues}>
                            <InputLabel id="answerValues" shrink>
                              Selected Answers *
                            </InputLabel>
                            <Select
                              labelId="answerValues"
                              multiple
                              displayEmpty
                              onChange={(event: React.ChangeEvent<{ value: string[] }>) => {
                                onChange(event.target.value);
                              }}
                              value={value}
                              renderValue={selected => (
                                <div className={classes.chips}>
                                  {(selected as string[]).map(answerValue => (
                                    <Chip
                                      key={answerValue}
                                      label={getAnswerName(answerValue)}
                                      className={classes.chip}
                                      clickable={false}
                                      onDelete={e => {
                                        e.preventDefault();
                                        onChange(value.filter((a: string) => a !== answerValue));
                                      }}
                                      deleteIcon={<CancelIcon onMouseDown={event => event.stopPropagation()} />}
                                    />
                                  ))}
                                </div>
                              )}
                            >
                              {answers.map(({ id, description }) => (
                                <MenuItem key={id} value={id}>
                                  <Checkbox checked={value.includes(id)} color="primary" />
                                  {description}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.answerValues && <FormHelperText>{errors.answerValues?.message}</FormHelperText>}
                          </FormControl>
                        )}
                      />
                    </Box>
                  </Grid>
                )}
              </>
            )}
            {!!questionSectionId && questions?.length === 0 && scoringError('No questions available')}
            {questionType === QuestionType.NotSupported && scoringError('This Scoring is not yet supported')}
          </Grid>
        </GridContainer>
      </Paper>
    </Grid>
  );
};
