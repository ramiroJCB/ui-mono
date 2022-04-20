import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import { createStyles, Theme, withStyles, WithStyles, withTheme, WithTheme } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { IPredictiveRanking } from 'interfaces/predictiveRanking';
import { Paper } from '@pec/aion-ui-components/components/Paper';
import { PredictiveRankingHeaderComponent } from './PredictiveRankingHeader';
import { PredictiveRankingSummaryComponent } from './PredictiveRankingExpansionSummary';
import { PredictiveRankingTableComponent } from './PredictiveRankingTable';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      paddingTop: 0
    },
    panel: {
      margin: `0 ${theme.spacing(1) * -1.5}px`,
      '&:last-child': {
        marginBottom: theme.spacing(1) * -1.5
      }
    },
    panelSummary: {
      borderBottom: `1px solid ${theme.palette.divider}`
    },
    details: {
      marginTop: theme.spacing(1) * -1
    },
    table: {
      '& tr:last-child td': {
        borderBottom: 'none'
      }
    }
  });

type OwnProps = {
  predictiveRanking?: DeepReadonly<IPredictiveRanking>;
};
type Props = WithTheme & WithStyles<typeof styles> & OwnProps;

const PredictiveRankingTile: React.FC<Props> = ({ predictiveRanking, classes }) => (
  <Paper className={classes.paper}>
    <Accordion elevation={0} className={classes.panel}>
      <AccordionSummary className={classes.panelSummary} expandIcon={<ExpandMoreIcon />}>
        <PredictiveRankingSummaryComponent score={predictiveRanking ? predictiveRanking.score : undefined} />
      </AccordionSummary>
      <AccordionDetails className={classes.details}>
        <Table className={classes.table}>
          <PredictiveRankingHeaderComponent />
          <PredictiveRankingTableComponent predictiveRanking={predictiveRanking ? predictiveRanking : undefined} />
        </Table>
      </AccordionDetails>
    </Accordion>
  </Paper>
);

export const PredictiveRankingTileComponent = withTheme(withStyles(styles)(PredictiveRankingTile));
