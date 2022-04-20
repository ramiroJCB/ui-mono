import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ClientOperationsRowDetailsContainer } from '../containers/ClientOperationsRowDetails';
import { IMetricContractor } from 'interfaces/metricContractor';
import { PeriodIconComponent } from 'components/PeriodIcon';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  details: {
    padding: 0,
    justifyContent: 'center'
  },
  summary: {
    '&:hover': {
      background: theme.palette.action.hover
    }
  }
});

type OwnProps = {
  contractor: IMetricContractor;
};

type Props = WithStyles<typeof styles> & OwnProps;

type State = {
  expanded: boolean;
};

class ClientOperationsRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleOnChange = (_event: React.ChangeEvent<{}>, expanded: boolean) => this.setState({ expanded });

  render() {
    const { expanded } = this.state;
    const { contractor, classes } = this.props;
    const { displayMetricStatus, name } = contractor;

    return (
      <Accordion onChange={this.handleOnChange}>
        <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
          <Grid container spacing={3} justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body1">
                {displayMetricStatus && <PeriodIconComponent status={displayMetricStatus} />}
                {name}
              </Typography>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <ClientOperationsRowDetailsContainer contractor={contractor} expanded={expanded} />
        </AccordionDetails>
      </Accordion>
    );
  }
}

export const ClientOperationsRowComponent = withStyles(styles)(ClientOperationsRow);
