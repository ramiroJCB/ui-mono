import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { AddEditContactInformationContainer } from 'features/contractor/contactInformation/containers/AddEditContactInformation';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { HasPermissionContainer } from '@pec/aion-ui-components/containers/HasPermission';
import { IContactInformation } from 'interfaces/contactInformation';
import { Link } from '@pec/aion-ui-components/components/Link';

const styles = (theme: Theme) =>
  createStyles({
    hasContactInfoContainer: {
      margin: `${theme.spacing(2)}px 0`,
      '& label': {
        fontWeight: 'bold'
      }
    },
    noContactInfoContainer: {
      margin: 0
    },
    header: {
      fontWeight: 'bold'
    },
    hasContactInfoIcon: {
      margin: `-12px ${theme.spacing(1)}px`
    },
    noContactInfoIcon: {
      marginTop: `-4px ${theme.spacing(1)}px`
    }
  });

type OwnProps = {
  contactInformation: DeepReadonly<IContactInformation> | null;
  viewAsClient: boolean;
};

type Props = OwnProps & WithStyles<typeof styles>;

const ContactInformation: React.FC<Props> = ({ classes, contactInformation, viewAsClient }) => {
  const hasContactInformation =
    contactInformation &&
    (contactInformation.phoneNumber || contactInformation.emailAddress || contactInformation.websiteUrl);

  return (
    <HasPermissionContainer>
      {({ hasOrganizationAssetPermission }) => (
        <Grid
          container
          className={hasContactInformation ? classes.hasContactInfoContainer : classes.noContactInfoContainer}
        >
          {contactInformation &&
            (contactInformation.phoneNumber || contactInformation.emailAddress || contactInformation.websiteUrl) && (
              <Grid item>
                <Typography variant="body1" className={classes.header}>
                  Contact Information
                </Typography>
                {contactInformation.phoneNumber && (
                  <Typography variant="body2">
                    <label>Phone:</label> {contactInformation.phoneNumber}
                  </Typography>
                )}
                {contactInformation.emailAddress && (
                  <Typography variant="body2">
                    <label>Email:</label>{' '}
                    <Link href={`mailto:${contactInformation.emailAddress}`}>{contactInformation.emailAddress}</Link>
                  </Typography>
                )}
                {contactInformation.websiteUrl && (
                  <Typography variant="body2">
                    <label>Website:</label>{' '}
                    <Link href={contactInformation.websiteUrl} target="_blank" rel="noopener noreferrer">
                      {contactInformation.websiteUrl}
                    </Link>
                  </Typography>
                )}
              </Grid>
            )}
          {hasOrganizationAssetPermission() && !viewAsClient && (
            <Grid item className={hasContactInformation ? classes.hasContactInfoIcon : classes.noContactInfoIcon}>
              <AddEditContactInformationContainer />
            </Grid>
          )}
        </Grid>
      )}
    </HasPermissionContainer>
  );
};

export const ContactInformationComponent = withStyles(styles)(ContactInformation);
