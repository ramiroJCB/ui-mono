import * as React from 'react';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MuiAccordion from '@material-ui/core/Accordion';
import SignText from 'mdi-material-ui/SignText';
import Truncate from 'react-truncate';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { Divider } from '@material-ui/core';
import { ISearchResultWithLogo } from 'interfaces/searchResult';
import { Link } from '@pec/aion-ui-components/components/Link';
import { RouteComponentProps, withRouter } from 'react-router-dom';

type RouteParams = {
  organizationId: string;
};

const styles = (theme: Theme) =>
  createStyles({
    logo: {
      width: 24,
      height: 24
    },
    selectedBackground: {
      background: theme.palette.grey[200]
    },
    summaryRoot: {
      justifyContent: 'flex-start'
    },
    summaryContainerText: {
      padding: `0 ${theme.spacing(3)}px`,
      fontWeight: theme.typography.fontWeightMedium
    },
    connectionStatus: {
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.grey[600],
      textAlign: 'right'
    },
    tradeName: {
      fontWeight: theme.typography.fontWeightMedium
    },
    profileButton: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    linkText: {
      textDecoration: 'none'
    },
    details: {
      padding: theme.spacing(3)
    },
    descriptionGrid: {
      marginBottom: theme.spacing(1),
      maxHeight: 85,
      minHeight: 85
    },
    tradeNameGrid: {
      marginBottom: theme.spacing(1)
    }
  });

type OwnProps = {
  searchResult: DeepReadonly<ISearchResultWithLogo>;
  style: React.CSSProperties;
  expanded: boolean;
  selected: boolean;
  handleOnClick: () => void;
  containerWidth: number;
  fetchSearchResultLogoIfNeeded: (organizationId: string) => void;
};

const Accordion = withStyles((theme: Theme) =>
  createStyles({
    root: {
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0
      },
      '&:before': {
        display: 'none'
      }
    },
    expanded: {
      margin: '0 !important'
    }
  })
)(MuiAccordion);

type Props = OwnProps & WithStyles<typeof styles> & RouteComponentProps<RouteParams>;

export class SearchResultsPanelComponent extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    props.fetchSearchResultLogoIfNeeded(props.searchResult.id);
  }

  render() {
    const {
      searchResult,
      expanded,
      selected,
      handleOnClick,
      style,
      classes,
      containerWidth,
      match: {
        params: { organizationId }
      },
      location: { search }
    } = this.props;
    const { id, name, description, logo, city, state, zipCode, connectionStatus, tradeName } = searchResult;

    return (
      <Accordion style={style} square expanded={expanded} className={selected ? classes.selectedBackground : undefined}>
        <AccordionSummary classes={{ root: classes.summaryRoot }} onClick={handleOnClick}>
          <Grid container style={{ maxWidth: containerWidth / 1.12, padding: 0 }}>
            <Grid item xs={1} style={{ alignSelf: 'center' }}>
              {logo ? (
                <img src={URL.createObjectURL(logo)} alt="logo" className={classes.logo} />
              ) : (
                <SignText color="action" />
              )}
            </Grid>
            <Grid item xs={expanded ? 8 : 11} style={{ alignSelf: 'center' }}>
              <Typography className={classes.summaryContainerText} variant="body1" noWrap>
                {name}
              </Typography>
              {expanded && (
                <div style={{ minHeight: 21 }}>
                  {city && state && zipCode && (
                    <Typography className={classes.summaryContainerText} variant="body2" noWrap>
                      {city}, {state} {zipCode}
                    </Typography>
                  )}
                </div>
              )}
            </Grid>
            {expanded && (
              <Grid item xs={3}>
                <Typography variant="subtitle2" className={classes.connectionStatus}>
                  {connectionStatus}
                </Typography>
              </Grid>
            )}
          </Grid>
        </AccordionSummary>
        <Divider variant="inset" />
        <AccordionDetails classes={{ root: classes.details }}>
          <Grid container>
            {description ? (
              <Grid item xs={12} className={classes.descriptionGrid}>
                <Typography style={{ whiteSpace: 'nowrap' }}>
                  <Truncate lines={3}>{description}</Truncate>
                </Typography>
                {tradeName && (
                  <Typography variant="body2" className={classes.tradeName} noWrap>
                    TradeName: {tradeName}
                  </Typography>
                )}
              </Grid>
            ) : (
              tradeName && (
                <Grid item xs={12} className={classes.tradeNameGrid}>
                  <Typography variant="body2" className={classes.tradeName} noWrap>
                    TradeName: {tradeName}
                  </Typography>
                </Grid>
              )
            )}
            <Grid item xs={12} className={classes.profileButton}>
              <Link
                to={{
                  pathname: `/${organizationId}/connect/profile/${id}`,
                  search
                }}
                className={classes.linkText}
              >
                <Button>View Profile</Button>
              </Link>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export const SearchResultsPanel = withStyles(styles)(withRouter(SearchResultsPanelComponent));
