import * as React from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { Error } from '@pec/aion-ui-components/components/Error';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IAttachment } from '@pec/aion-ui-core/interfaces/attachment';
import { ICreatedMessage } from 'interfaces/message';
import { ITaskAssigneeStatus } from 'interfaces/taskAssigneeDetails';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { Message } from './Message';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { TablePagination } from '@pec/aion-ui-components/components/Table/TablePagination';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

const styles = (theme: Theme) =>
  createStyles({
    clientReply: {
      backgroundColor: 'rgba(0, 0, 0, .09)',
      borderBottom: '1px solid rgba(0, 0, 0, .125)'
    },
    heading: {
      display: 'flex',
      alignItems: 'center',
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '10%',
      flexShrink: 0,
      color: theme.palette.text.secondary
    },
    secondaryHeading: {
      display: 'flex',
      flexBasis: '90%',
      alignItems: 'center',
      padding: '0 10px',
      fontSize: theme.typography.pxToRem(15)
    },
    leftIcon: {
      marginRight: theme.spacing(1)
    },
    statusIcon: {
      lineHeight: 1,
      padding: '0 10px'
    },
    sortIcon: {
      color: 'rgba(0, 0, 0, 0.54)',
      width: '1em',
      height: '1em'
    }
  });

type OwnProps = {
  downloadAttachment: (attachment: IAttachment) => void;
  isAssignee: boolean;
  taskMessages: DeepReadonly<ICreatedMessage[] | null>;
  organizationId: string;
  page: number;
  sortOrder: 'asc' | 'desc';
  totalCount: number;
  isFetching: boolean;
  error: DeepReadonly<AxiosError | null>;
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeSortOrder: (order: string) => void;
  statuses: DeepReadonly<ITaskAssigneeStatus[]>;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  panels: { [panel: string]: boolean } | null;
  expandAll: boolean;
  sortOrder: 'asc' | 'desc';
};

export class MessagesComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      panels: null,
      expandAll: false,
      sortOrder: props.sortOrder
    };
  }

  componentDidUpdate({ taskMessages: prevTaskMessages }: Props) {
    const { taskMessages, page } = this.props;
    const { sortOrder } = this.state;

    if (taskMessages && taskMessages !== prevTaskMessages) {
      this.setState({
        panels: taskMessages.reduce(
          (p, _k, i) => ({ ...p, [`panel${i}`]: i === 0 && page === 0 && sortOrder !== 'asc' ? true : false }),
          {}
        )
      });
    }
  }

  handleSortOrder = (_event: React.SyntheticEvent) => {
    const { sortOrder: prevSortOrder } = this.state;
    const sortOrder = prevSortOrder === 'asc' ? 'desc' : 'asc';

    this.setState({ sortOrder });
    this.props.handleChangeSortOrder(sortOrder);
  };

  handleExpand = (_event: React.SyntheticEvent) =>
    this.state.panels &&
    this.setState({
      panels: Object.keys(this.state.panels).reduce((p, k) => ({ ...p, [k]: !this.state.expandAll }), {}),
      expandAll: !this.state.expandAll
    });

  handleChangePanel = (panel: string) => () =>
    this.state.panels && this.setState({ panels: { ...this.state.panels, [panel]: !this.state.panels[panel] } });

  render() {
    const {
      classes,
      downloadAttachment,
      isAssignee,
      totalCount,
      taskMessages,
      organizationId,
      handleChangePage,
      page,
      isFetching,
      error,
      statuses,
      t
    } = this.props;
    const { panels, sortOrder: order, expandAll } = this.state;

    return (
      <GridContainer>
        <Grid item xs={12}>
          <GridContainer justify="space-between" alignItems="center" spacing={0}>
            <Grid item>
              <Typography variant="h6" component="h3">
                {t('alert.taskThread.taskMessages.count', {
                  count: totalCount,
                  defaultValue_plural: '{{count}} Messages',
                  defaultValue: '{{count}} Message'
                })}
              </Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Sort by Latest or Oldest" enterDelay={300}>
                <IconButton aria-label="Expand" onClick={this.handleSortOrder}>
                  <TableSortLabel active direction={order} classes={{ icon: classes.sortIcon }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Expand or Collapse All Messages" enterDelay={300}>
                <IconButton aria-label="Expand" onClick={this.handleExpand}>
                  <TableSortLabel
                    active
                    direction={expandAll ? 'asc' : 'desc'}
                    IconComponent={ExpandMoreIcon}
                    classes={{ icon: classes.sortIcon }}
                  />
                </IconButton>
              </Tooltip>
            </Grid>
          </GridContainer>
          {!isFetching && !error ? (
            taskMessages && taskMessages.length ? (
              taskMessages.map((m, i) => (
                <Message
                  key={m.id}
                  organizationId={organizationId}
                  expanded={panels && panels[`panel${i}`] ? true : false}
                  handleChange={this.handleChangePanel(`panel${i}`)}
                  message={m}
                  status={statuses.find(status => status.messageId === m.id)}
                  downloadAttachment={downloadAttachment}
                  isAssignee={isAssignee}
                />
              ))
            ) : (
              <Paper>
                <Typography align="center" variant="body1">
                  No messages have been added.
                </Typography>
              </Paper>
            )
          ) : error ? (
            <Error />
          ) : (
            <Loading />
          )}
          {totalCount > 0 && (
            <TablePagination
              component="div"
              handleChangePage={handleChangePage}
              page={page}
              totalCount={totalCount}
              rowsPerPage={10}
            />
          )}
        </Grid>
      </GridContainer>
    );
  }
}

export const Messages = withStyles(styles)(withTranslation()(MessagesComponent));
