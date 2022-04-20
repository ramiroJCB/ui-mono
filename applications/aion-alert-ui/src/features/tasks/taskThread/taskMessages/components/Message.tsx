import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ForwardIcon from '@material-ui/icons/Forward';
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import ReactHtmlParser from 'html-react-parser';
import ReplyIcon from '@material-ui/icons/Reply';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { getImpliedIconStatus } from 'helpers/status';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { ICreatedMessage } from 'interfaces/message';
import { ITaskAssigneeStatus } from 'interfaces/taskAssigneeDetails';
import { MessageAttachments } from 'components/MessageAttachments';
import { TaskStatusIcon } from 'components/TaskStatusIcon';

const styles = (theme: Theme) =>
  createStyles({
    messageDate: {
      marginTop: theme.spacing(1)
    },
    messageHeader: {
      color: theme.palette.text.secondary
    },
    messageIcon: {
      lineHeight: 1,
      padding: '0 10px',
      marginTop: theme.spacing(1)
    },
    messageUserName: {
      padding: `0 ${theme.spacing(4)}px`
    },
    panelDetails: {
      padding: `0 ${theme.spacing(3)}px ${theme.spacing(3)}px`
    }
  });

type OwnProps = {
  downloadAttachment: (attachment: IAttachment) => void;
  isAssignee: boolean;
  organizationId: string;
  expanded: boolean;
  handleChange: () => void;
  message: DeepReadonly<ICreatedMessage>;
  status?: ITaskAssigneeStatus;
};

type Props = WithStyles<typeof styles> & OwnProps;

type State = {
  formattedCreatedDate: string;
  intervalId: number | NodeJS.Timer;
};

export class MessageComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      formattedCreatedDate: moment(moment.utc(props.message.createdDateUtc).toDate())
        .local()
        .fromNow(),
      intervalId: 0
    };
  }

  componentDidMount() {
    this.setState({ intervalId: this.setTimerForPostTime() });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId as number);
  }

  setTimerForPostTime = () => {
    const {
      message: { createdDateUtc }
    } = this.props;

    return setInterval(
      () =>
        this.setState({
          formattedCreatedDate: moment(moment.utc(createdDateUtc).toDate())
            .local()
            .fromNow()
        }),
      60000
    );
  };

  render() {
    const {
      classes,
      downloadAttachment,
      expanded,
      handleChange,
      isAssignee,
      organizationId,
      message: { senderId, senderName, createdByUserName, content, attachments },
      status
    } = this.props;
    const { formattedCreatedDate } = this.state;

    return (
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <GridContainer spacing={0} className={classes.messageHeader}>
            <Grid item className={classes.messageIcon}>
              {organizationId === senderId ? <ForwardIcon /> : <ReplyIcon />}
            </Grid>
            <GridContainer spacing={1} justify="space-between" alignItems="center">
              <Grid item>
                <GridContainer spacing={0}>
                  <Grid item className={classes.messageUserName}>
                    <Typography>{createdByUserName.toLocaleUpperCase()}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="inherit">
                      {senderName}
                    </Typography>
                  </Grid>
                </GridContainer>
              </Grid>
              <Grid item lg={2}>
                <GridContainer spacing={0} justify="space-around">
                  <Grid item xs={1}>
                    {status ? (
                      <TaskStatusIcon status={getImpliedIconStatus(isAssignee, status.status)} tooltipPlacement="top" />
                    ) : null}
                  </Grid>
                  <Grid item xs={11}>
                    <Typography variant="body2" color="inherit" align="center" className={classes.messageDate}>
                      {formattedCreatedDate}
                    </Typography>
                  </Grid>
                </GridContainer>
              </Grid>
            </GridContainer>
          </GridContainer>
        </AccordionSummary>
        <AccordionDetails className={classes.panelDetails}>
          <GridContainer spacing={0}>
            <Grid item xs={12}>
              <Typography variant="body2" component="div">
                {ReactHtmlParser(content)}
              </Typography>
            </Grid>
            {attachments && attachments.length > 0 && (
              <MessageAttachments downloadAttachment={downloadAttachment} attachments={attachments} />
            )}
          </GridContainer>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export const Message = withStyles(styles)(MessageComponent);
