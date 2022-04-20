import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Chip from '@material-ui/core/Chip';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import MaterialUILink from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IRanking } from '@pec/aion-ui-core/interfaces/ranking';
import { Link } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';
import { Tile } from 'components/Tile';
import { useTranslation, Trans } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    chip: {
      color: 'white',
      fontWeight: 'bold',
      marginRight: theme.spacing(3)
    },
    panel: {
      borderTop: `1px solid ${theme.palette.divider}`,
      margin: `0 -${theme.spacing(1.5)}px`,
      '&:last-child': {
        marginBottom: `-${theme.spacing(1.5)}px`
      }
    },
    table: {
      '& tr:last-child td': {
        borderBottom: 'none'
      }
    },
    tableCell: {
      width: '50%'
    }
  });

type RouteParams = {
  organizationId: string;
};

type OwnProps = {
  rankings: DeepReadonly<IRanking[]>;
  handleClick: (organizationId: string) => () => void;
};

type Props = WithStyles<typeof styles> & RouteComponentProps<RouteParams> & OwnProps;

const ClientScoresTile: React.FC<Props> = ({
  match: {
    params: { organizationId }
  },
  rankings,
  handleClick,
  classes
}) => {
  const { t } = useTranslation();

  return (
    <Tile primaryText={t('subscriber.dashboard.clientScoresTile.title', 'Client Scores')}>
      {rankings.length > 0 ? (
        rankings.map(ranking => (
          <Accordion
            elevation={0}
            key={ranking.organization.id}
            expanded={ranking.isExpanded}
            className={classes.panel}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} onClick={handleClick(ranking.organization.id)}>
              <GridContainer spacing={0} justify="space-between">
                <Grid item>
                  <Typography variant="h6">{ranking.organization.name}</Typography>
                </Grid>
                {ranking.overallRanking && (
                  <Grid item>
                    <Chip
                      label={ranking.overallRanking.label}
                      style={{ backgroundColor: ranking.overallRanking.color }}
                      className={classes.chip}
                    />
                  </Grid>
                )}
              </GridContainer>
            </AccordionSummary>
            <AccordionDetails>
              <Table className={classes.table}>
                <TableBody>
                  {ranking.moduleRankings.map((moduleRanking: any) => (
                    <TableRow key={`${ranking.organization.id}-${moduleRanking.name}`}>
                      <TableCell className={classes.tableCell}>
                        <Typography variant="body1">
                          <span
                            style={{
                              color: moduleRanking.color
                            }}
                          >
                            ⬤
                          </span>{' '}
                          {moduleRanking.name}
                        </Typography>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <Typography variant="body1">{moduleRanking.value}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <GridContainer>
          <Grid item xs={12}>
            <Typography variant="h6">
              {t('subscriber.dashboard.clientScoresTile.noClientScores', 'No Client Scores are Available')}
            </Typography>
            <Typography variant="body1">
              <Trans i18nKey="subscriber.dashboard.clientScoresTile.reminder">
                Please ensure your{' '}
                <MaterialUILink underline="always" component={Link} to={`/${organizationId}/questionnaire/1`}>
                  Company Profile
                </MaterialUILink>{' '}
                is completed and your{' '}
                <MaterialUILink underline="always" component={Link} to={`/${organizationId}/questionnaire/3`}>
                  Releases
                </MaterialUILink>{' '}
                are up-to-date.
              </Trans>
            </Typography>
          </Grid>
        </GridContainer>
      )}
    </Tile>
  );
};

export const ClientScoresTileComponent = withStyles(styles)(withRouter(ClientScoresTile));
