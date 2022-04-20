import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import ReactHtmlParser, { DomElement, domToReact } from 'html-react-parser';
import Typography from '@material-ui/core/Typography';
import { DeepReadonly } from 'ts-essentials';
import { formatDate } from '@pec/aion-ui-core/components/LocalizedDate';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { ITaskGroup } from '@pec/aion-ui-core/interfaces/taskGroup';
import { MessageAttachments } from 'components/MessageAttachments';

type Props = {
  taskGroup: DeepReadonly<ITaskGroup>;
  downloadAttachment: (attachment: IAttachment) => void;
  isAssignee: boolean;
  taskNumber?: number;
};

export const TaskGroupDetails: React.FC<Props> = ({
  taskGroup: {
    attachments,
    canAssigneeComplete,
    content,
    createdDateUtc,
    dueDateUtc,
    isAttachmentRequiredForCompletion
  },
  taskNumber,
  downloadAttachment,
  isAssignee
}: Props) => {
  const formatContentText = (domNode: DomElement): React.ReactElement | object | undefined | false => {
    if (domNode.name === 'p') {
      return (
        <p style={{ marginTop: 0 }}>
          {domToReact(domNode.children || [], {
            replace: domNode => formatContentText(domNode)
          })}
        </p>
      );
    }

    return undefined;
  };

  return (
    <React.Fragment>
      <GridContainer>
        <Grid item xs={12} md={6}>
          {taskNumber && (
            <GridContainer>
              <Grid item xs={6} sm={4} lg={2}>
                <Typography variant="subtitle2">Task Number:</Typography>
              </Grid>
              <Grid item>
                <Typography>{taskNumber}</Typography>
              </Grid>
            </GridContainer>
          )}
          <GridContainer>
            <Grid item xs={6} sm={4} lg={2}>
              <Typography variant="subtitle2">Created Date:</Typography>
            </Grid>
            <Grid item>
              <Typography>{formatDate(createdDateUtc)}</Typography>
            </Grid>
          </GridContainer>
          <GridContainer>
            <Grid item xs={6} sm={4} lg={2}>
              <Typography variant="subtitle2">Due Date:</Typography>
            </Grid>
            <Grid item>
              <Typography>{formatDate(dueDateUtc)}</Typography>
            </Grid>
          </GridContainer>
        </Grid>
        {!isAssignee && (
          <Grid item xs={12} md={6}>
            <GridContainer>
              <Grid item xs={6} sm={4} md={7} lg={4}>
                <Typography variant="subtitle2">Assignee attachment required:</Typography>
              </Grid>
              <Grid item>
                <Typography>{isAttachmentRequiredForCompletion ? 'Yes' : 'No'}</Typography>
              </Grid>
            </GridContainer>
            <GridContainer>
              <Grid item xs={6} sm={4} md={7} lg={4}>
                <Typography variant="subtitle2">Assignee can complete:</Typography>
              </Grid>
              <Grid item>
                <Typography>{canAssigneeComplete ? 'Yes' : 'No'}</Typography>
              </Grid>
            </GridContainer>
          </Grid>
        )}
        <Grid item xs={12}>
          <GridContainer>
            <Grid item xs={12} sm={4} md={2} lg={1}>
              <Typography variant="subtitle2">Content:</Typography>
            </Grid>
            <Grid item xs={12} sm={8} md={10} lg={11}>
              <Typography variant="body2" component="div">
                {ReactHtmlParser(content, {
                  replace: domNode => formatContentText(domNode)
                })}
              </Typography>
            </Grid>
          </GridContainer>
        </Grid>
      </GridContainer>
      {attachments && attachments.length > 0 && (
        <GridContainer alignItems="center">
          <Grid item xs={4} md={2} lg={1}>
            <Typography variant="subtitle2">Attachments:</Typography>
          </Grid>
          <Grid item xs={12} md={10}>
            <MessageAttachments downloadAttachment={downloadAttachment} attachments={attachments} />
          </Grid>
        </GridContainer>
      )}
    </React.Fragment>
  );
};
