import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { AxiosError } from 'axios';
import { Button } from '@material-ui/core';
import { ContactInformationContainer } from 'features/contractor/contactInformation/containers/ContactInformation';
import { DeepReadonly } from 'utility-types';
import { EditDescriptionContainer } from '../../organizationDescription/containers/EditDescription';
import { Error } from '@pec/aion-ui-components/components/Error';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { IOrganization } from '@pec/aion-ui-core/interfaces/organization';
import { IUploadedImage } from 'interfaces/uploadedImage';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { LogoContainer } from 'features/contractor/logo/containers/Logo';
import { PhotoGalleryContainer } from 'features/contractor/photoGallery/containers/PhotoGallery';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';

const styles = (theme: Theme) => ({
  topGrid: {
    paddingTop: theme.spacing(1) * -2
  },
  paper: {
    minHeight: 365,
    padding: theme.spacing(4)
  },
  item: {
    padding: theme.spacing(2, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(4, 0)
    }
  },
  companyName: {
    fontWeight: 500,
    marginBottom: theme.spacing(2)
  },
  descriptionContainer: {
    margin: theme.spacing(2, 0)
  },
  description: {
    maxWidth: '75%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%'
    }
  },
  descriptionText: {
    color: theme.palette.grey[600]
  },
  icon: {
    margin: `-12px ${theme.spacing()}px`
  },
  leftIcon: {
    marginRight: theme.spacing()
  },
  noDescription: {
    margin: 0
  },
  root: {
    width: '100%',
    minHeight: 300,
    display: 'flex',
    alignItems: 'center'
  }
});

type OwnProps = {
  organization: DeepReadonly<IOrganization> | null;
  isFetching: boolean;
  error: DeepReadonly<AxiosError | Error> | null;
  viewAsClient: boolean;
  isClient?: boolean;
  metaData: DeepReadonly<IUploadedImage[]>;
  contractorId?: string;
};

type Props = OwnProps & WithStyles<typeof styles>;

const Jumbotron: React.FC<Props> = ({
  classes,
  organization,
  isFetching,
  error,
  viewAsClient,
  isClient,
  metaData,
  contractorId
}) => (
  <HasPermissionContainer>
    {({ hasOrganizationAssetPermission }) => (
      <Grid item xs={12} style={{ paddingTop: !isClient ? 0 : 10 }}>
        <Paper className={classes.paper}>
          {organization && !isFetching ? (
            <Grid container direction="row" justify={metaData.length ? 'space-between' : 'flex-start'}>
              <LogoContainer />
              <Grid item xs={12} md={8} className={classes.item}>
                <Typography variant="h4" className={classes.companyName}>
                  {organization.name}
                </Typography>
                <Grid container className={organization.description ? classes.descriptionContainer : undefined}>
                  {organization.description && (
                    <Grid item xs={11} className={classes.description}>
                      <Typography className={classes.descriptionText} variant="body2">
                        {organization.description}
                      </Typography>
                    </Grid>
                  )}
                  {hasOrganizationAssetPermission() && !viewAsClient && (
                    <Grid item className={organization.description ? classes.icon : classes.noDescription}>
                      <EditDescriptionContainer />
                    </Grid>
                  )}
                </Grid>
                <ContactInformationContainer />
                {contractorId && (
                  <Grid item>
                    <Button
                      component="a"
                      href={`/SSQV4/SSQV5/Contractor/Index?id=${contractorId}`}
                      target="_blank"
                      rel="noopener"
                    >
                      <OpenInNewIcon className={classes.leftIcon} />
                      Company Dashboard
                    </Button>
                  </Grid>
                )}
              </Grid>
              <PhotoGalleryContainer />
            </Grid>
          ) : error ? (
            <div className={classes.root}>
              <Error message="There was an error processing your request." />
            </div>
          ) : (
            <div className={classes.root}>
              <Loading />
            </div>
          )}
        </Paper>
      </Grid>
    )}
  </HasPermissionContainer>
);

export const JumbotronComponent = withStyles(styles)(Jumbotron);
