import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { AccreditationsContainer } from 'features/contractor/accreditations/containers/Accreditations';
import { AnnouncementsContainer } from 'features/contractor/announcements/containers/Announcements';
import { CertificationsContainer } from 'features/contractor/certifications/containers/Certifications';
import { CompletionContainer } from 'features/contractor/completion/containers/Completion';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { Hidden } from '@material-ui/core';
import { IAccreditation } from 'interfaces/accreditation';
import { IAnnouncement } from 'interfaces/announcement';
import { ICertification } from 'interfaces/certification';
import { ILicense } from 'interfaces/license';
import { IProject } from 'interfaces/project';
import { IReference } from 'interfaces/reference';
import { ITradeName } from 'interfaces/tradeName';
import { LicensesContainer } from 'features/contractor/licenses/containers/Licenses';
import { Link } from 'react-scroll';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OfficeLocationsContainer } from 'features/contractor/officeLocations/containers/OfficeLocations';
import { ProjectsContainer } from 'features/contractor/projects/containers/Projects';
import { ReferencesContainer } from 'features/contractor/references/containers/References';
import { TradeNamesContainer } from 'features/contractor/tradeNames/containers/TradeNames';

const styles = (theme: Theme) =>
  createStyles({
    subNavGridItem: {
      position: 'sticky',
      top: 75,
      height: 0
    },
    activeMenuItem: {
      borderRight: `${theme.palette.primary.main} 4px solid;`,
      '& span': {
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    menuList: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      padding: theme.spacing(1, 2)
    }
  });

type OwnProps = {
  isFetching: boolean;
  viewAsClient: boolean;
  references: DeepReadonly<IReference[]> | null;
  announcement: DeepReadonly<IAnnouncement> | null;
  projects: DeepReadonly<IProject[]> | null;
  licenses: DeepReadonly<ILicense[]> | null;
  certifications: DeepReadonly<ICertification[]> | null;
  accreditations: DeepReadonly<IAccreditation[]> | null;
  tradeNames: DeepReadonly<ITradeName[]> | null;
};

type Props = OwnProps & WithStyles<typeof styles>;

const offset = -65;
const ProfileContent: React.FC<Props> = ({
  isFetching,
  classes,
  viewAsClient,
  references,
  announcement,
  projects,
  licenses,
  certifications,
  accreditations,
  tradeNames
}) =>
  !isFetching ? (
    <Grid container justify="space-between" style={{ height: '100%' }}>
      <Grid item xs={12} md={9}>
        <GridContainer spacing={5}>
          <CompletionContainer />
          {((viewAsClient && announcement) || !viewAsClient) && <AnnouncementsContainer />}
          {((viewAsClient && projects && projects.length) || !viewAsClient) && <ProjectsContainer />}
          {((viewAsClient && licenses && licenses.length) || !viewAsClient) && <LicensesContainer />}
          {((viewAsClient && accreditations && accreditations.length) || !viewAsClient) && <AccreditationsContainer />}
          {((viewAsClient && certifications && certifications.length) || !viewAsClient) && <CertificationsContainer />}
          <OfficeLocationsContainer />
          {((viewAsClient && references && references.length) || !viewAsClient) && <ReferencesContainer />}
          {((viewAsClient && tradeNames && tradeNames.length) || !viewAsClient) && <TradeNamesContainer />}
        </GridContainer>
      </Grid>
      <Hidden smDown>
        <Grid item md={3} className={classes.subNavGridItem}>
          <MenuList className={classes.menuList}>
            {((viewAsClient && announcement) || !viewAsClient) && (
              <Link activeClass={classes.activeMenuItem} to="announcements" spy smooth duration={500} offset={offset}>
                <MenuItem>
                  <ListItemText inset primary="Announcements" />
                </MenuItem>
              </Link>
            )}
            {((viewAsClient && projects && projects.length) || !viewAsClient) && (
              <Link activeClass={classes.activeMenuItem} to="projects" spy smooth duration={500} offset={offset}>
                <MenuItem>
                  <ListItemText inset primary="Projects" />
                </MenuItem>
              </Link>
            )}
            {((viewAsClient && licenses && licenses.length) || !viewAsClient) && (
              <Link activeClass={classes.activeMenuItem} to="licenses" spy smooth duration={500} offset={offset}>
                <MenuItem>
                  <ListItemText inset primary="Licenses" />
                </MenuItem>
              </Link>
            )}
            {((viewAsClient && accreditations && accreditations.length) || !viewAsClient) && (
              <Link activeClass={classes.activeMenuItem} to="accreditations" spy smooth duration={500} offset={offset}>
                <MenuItem>
                  <ListItemText inset primary="Accreditations" />
                </MenuItem>
              </Link>
            )}
            {((viewAsClient && certifications && certifications.length) || !viewAsClient) && (
              <Link activeClass={classes.activeMenuItem} to="certifications" spy smooth duration={500} offset={offset}>
                <MenuItem>
                  <ListItemText inset primary="Certifications" />
                </MenuItem>
              </Link>
            )}
            <Link activeClass={classes.activeMenuItem} to="office-locations" spy smooth duration={500} offset={offset}>
              <MenuItem>
                <ListItemText inset primary="Offices and Locations" />
              </MenuItem>
            </Link>
            {((viewAsClient && references && references.length) || !viewAsClient) && (
              <Link activeClass={classes.activeMenuItem} to="references" spy smooth duration={500} offset={offset}>
                <MenuItem>
                  <ListItemText inset primary="References" />
                </MenuItem>
              </Link>
            )}
            {((viewAsClient && tradeNames && tradeNames.length) || !viewAsClient) && (
              <Link activeClass={classes.activeMenuItem} to="tradeNames" spy smooth duration={500} offset={offset}>
                <MenuItem>
                  <ListItemText inset primary="Trade Names" />
                </MenuItem>
              </Link>
            )}
          </MenuList>
        </Grid>
      </Hidden>
    </Grid>
  ) : (
    <Grid container item>
      <Loading />
    </Grid>
  );

export const ProfileContentComponent = withStyles(styles)(ProfileContent);
