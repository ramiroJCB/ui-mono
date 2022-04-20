import * as React from 'react';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { DropResult } from 'react-beautiful-dnd';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { INestedQuestion, IQuestion } from 'interfaces/question';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { resolveQuestionNumber } from 'helpers/questionNumber';
import { WrappingLink } from '@pec/aion-ui-components/components/WrappingLink';

const styles = (theme: Theme) =>
  createStyles({
    dragHandle: {
      textAlign: 'center'
    },
    question: {
      '&:hover': {
        background: theme.palette.action.hover
      },
      borderBottom: `1px solid ${theme.palette.divider}`,
      cursor: 'pointer',
      paddingLeft: theme.spacing(1.5)
    }
  });

type OwnProps = {
  title: string;
  questions: DeepReadonly<IQuestion[]>;
  topLevelQuestions: DeepReadonly<INestedQuestion[]>;
  safetyProgramId: string;
  onDragEnd: (result: DropResult) => Promise<void>;
};

type Props = WithStyles<typeof styles> & OwnProps;

const Component: React.FC<Props> = ({
  title,
  questions,
  topLevelQuestions,
  safetyProgramId,
  onDragEnd,
  children,
  classes
}) => (
  <Paper variant="outlined" style={{ padding: 0 }}>
    <GridContainer spacing={4}>
      <Grid item xs={12}>
        <Typography variant="subtitle2">{title}</Typography>
      </Grid>
      {questions.length > 0 && (
        <Grid item xs={12} style={{ padding: 0 }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {({ droppableProps, innerRef, placeholder }) => (
                <div {...droppableProps} ref={innerRef}>
                  {questions.map(({ id, title }, index) => (
                    <Draggable key={id} draggableId={id} index={index}>
                      {({ innerRef, draggableProps, dragHandleProps }) => (
                        <div ref={innerRef} {...draggableProps}>
                          <WrappingLink to={`/safety-programs/${safetyProgramId}/questions/${id}`}>
                            <GridContainer alignItems="center" key={id} className={classes.question}>
                              <Grid item xs={2}>
                                <Typography>{resolveQuestionNumber(topLevelQuestions, id)}</Typography>
                              </Grid>
                              <Grid item xs={9}>
                                <Typography>{title}</Typography>
                              </Grid>
                              <Grid item xs={1} className={classes.dragHandle}>
                                <div {...dragHandleProps}>
                                  <DragIndicatorIcon color="action" />
                                </div>
                              </Grid>
                            </GridContainer>
                          </WrappingLink>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>
      )}
      <Grid item xs={12}>
        {children}
      </Grid>
    </GridContainer>
  </Paper>
);

export const SortableQuestions = withStyles(styles)(Component);
