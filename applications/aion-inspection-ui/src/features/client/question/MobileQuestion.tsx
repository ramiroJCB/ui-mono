import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import Divider from '@material-ui/core/Divider';
import FormRender from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import Grid from '@material-ui/core/Grid';
import React from 'react';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';
import { addAnswer, answersAdapterSelectors, updateAnswer } from '../answers/slice';
import { BackTitleHeader } from 'common/components/BackTitleHeader';
import { componentMapper } from 'common/utils/componentMapper';
import { Drawer } from 'common/components/Drawer';
import { Error } from '@pec/aion-ui-components/components/Error';
import { FormTemplate } from 'common/components/FormTemplate';
import { InspectionInfo } from './InspectionInfo';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Moment } from 'moment';
import { questionsAdapterSelectors } from 'features/questions/slice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useAppDispatch, useTypedSelector } from 'app/reducer';
import { useHistory, useParams } from 'react-router-dom';
import { validatorMapper } from 'common/utils/validationMapper';

const useStyles = makeStyles((theme: Theme) => ({
  item: {
    padding: theme.spacing(2)
  },
  drawer: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

export const MobileQuestion: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { organizationId, inspectionId, sectionId, questionId } = useParams<{
    organizationId: string;
    inspectionId: string;
    sectionId: string;
    questionId: string;
  }>();

  const { isFetching: isFetchingQuestions, error: questionsError, section } = useTypedSelector(
    state => state.questions
  );
  const questions = useTypedSelector(questionsAdapterSelectors.selectAll);
  const question = useTypedSelector(state => questionsAdapterSelectors.selectById(state, questionId));
  const { isFetching: isFetchingAnswers, isSubmitting, error: answersError } = useTypedSelector(state => state.answers);
  const answers = useTypedSelector(answersAdapterSelectors.selectAll);
  const isFetching = isFetchingQuestions && isFetchingAnswers;
  const error = questionsError || answersError;

  const previousQuestion = questions[questions.findIndex(q => q.id === questionId) - 1];
  const nextQuestion = questions[questions.findIndex(q => q.id === questionId) + 1];
  const baseUrl = `/${organizationId}/reviews/${inspectionId}/inspection-sections/${sectionId}/questions`;
  const schema: Schema = { fields: [] };

  if (question && question.component !== componentTypes.SUB_FORM) {
    const { title, ...rest } = question;
    const answer = answers.find(({ questionId }) => questionId === question.id);
    const questionNumber = questions.findIndex(({ id }) => id === question.id) + 1;

    schema.fields.push({ ...rest, title: `${questionNumber}. ${title}`, initialValue: answer?.value });
  }

  if (question && question.component === componentTypes.SUB_FORM && 'fields' in question) {
    const { title, ...rest } = question;
    const questionNumber = questions.findIndex(({ id }) => id === question.id) + 1;
    const fields = question.fields?.map(({ ...rest }) => {
      const answer = answers.find(({ questionId }) => questionId === rest.id);
      return { ...rest, initialValue: answer?.value };
    });

    schema.fields.push({ ...rest, title: `${questionNumber}. ${title}`, fields });
  }

  const onSubmit = async (values: { [key: string]: Moment | string | string[] }, pristine?: boolean) => {
    if (!pristine) {
      const promises = Object.entries(values).map(async ([id, value]) => {
        return new Promise<void>(async (resolve, reject) => {
          try {
            const answer = answers.find(({ questionId }) => questionId === id);

            if (answer) {
              const result = await dispatch(updateAnswer({ ...answer, value }));
              unwrapResult(result);
            }

            if (!answer && id) {
              const result = await dispatch(addAnswer({ questionId: id, inspectionId, value }));
              unwrapResult(result);
            }

            resolve();
          } catch (error) {
            reject();
          }
        });
      });

      await Promise.all(promises);
    }

    history.push(nextQuestion ? `${baseUrl}/${nextQuestion.id}` : `/${organizationId}/reviews/${inspectionId}`);
  };

  return !isFetching && question && section ? (
    <React.Fragment>
      <Grid container classes={{ root: classes.item }} justify="space-between">
        <Grid item xs={10}>
          <BackTitleHeader
            linkTitle="Back To Review Section"
            to={`/${organizationId}/reviews/${inspectionId}/inspection-sections/${sectionId}`}
          >
            {section.name}
          </BackTitleHeader>
        </Grid>
        <Grid item xs={2} className={classes.drawer}>
          <Drawer>
            <InspectionInfo />
          </Drawer>
        </Grid>
      </Grid>
      <Divider />
      <Grid container classes={{ root: classes.item }}>
        <FormRender
          subscription={{ values: true, pristine: true }}
          componentMapper={componentMapper}
          validatorMapper={validatorMapper}
          FormTemplate={props => (
            <FormTemplate
              toPrevious={
                previousQuestion ? `${baseUrl}/${previousQuestion.id}` : `/${organizationId}/reviews/${inspectionId}`
              }
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              {...props}
            />
          )}
          schema={schema}
          onSubmit={() => {}} // This is a required prop on FormRender. The actual onSubmit is being passed to FormTemplate.
        />
      </Grid>
    </React.Fragment>
  ) : error ? (
    <Error message="There was an error processing your request." />
  ) : (
    <Loading />
  );
};
