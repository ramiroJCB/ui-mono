import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'ts-essentials';
import { FormSpy } from 'react-final-form';
import { GridContainer } from '@pec/aion-ui-components/components/GridContainer';
import { IClientServiceRegion } from 'interfaces/clientServiceRegion';
import { IMandateForm } from 'interfaces/mandate';
import { RegionalServicesContainer } from 'features/regionalServices/containers/RegionalServices';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeNumber } from '@pec/aion-ui-i18next/helpers/localize';

type OwnProps = {
  clientServiceRegions: DeepReadonly<IClientServiceRegion[]>;
};

const styles = (theme: Theme) =>
  createStyles({
    container: {
      paddingLeft: theme.spacing(2)
    },
    tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
      flex: 1
    },
    tab: {
      ...theme.typography.body2,
      flex: 0,
      opacity: 1,
      textAlign: 'left',
      fontSize: 16,
      textTransform: 'none',
      '&[aria-selected=true]': {
        background: theme.palette.action.selected
      },
      '&:not([aria-selected=true]):hover': {
        background: theme.palette.action.hover
      }
    },
    tabWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between'
    }
  });

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  selectedServiceRegionId?: string;
};

class Component extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedServiceRegionId: props.clientServiceRegions[0]?.serviceRegionId
    };
  }

  handleChange = (_event: React.ChangeEvent<{}>, selectedServiceRegionId: string) => {
    this.setState({ selectedServiceRegionId });
  };

  render() {
    const { clientServiceRegions, classes, t } = this.props;
    const { selectedServiceRegionId } = this.state;

    return (
      <GridContainer className={classes.container}>
        {clientServiceRegions.length > 0 ? (
          <React.Fragment>
            {clientServiceRegions.length > 1 && (
              <Grid item xs={4} style={{ display: 'flex' }}>
                <FormSpy<IMandateForm>>
                  {({ values: { regionalServiceIdsByRegion } }) => (
                    <Tabs
                      orientation="vertical"
                      value={selectedServiceRegionId}
                      onChange={this.handleChange}
                      className={classes.tabs}
                      variant="fullWidth"
                    >
                      {clientServiceRegions.map(({ serviceRegionId, serviceRegionName }) => {
                        const total = regionalServiceIdsByRegion[serviceRegionId]?.length || 0;

                        return (
                          <Tab
                            key={serviceRegionId}
                            value={serviceRegionId}
                            label={
                              <React.Fragment>
                                {serviceRegionName}
                                {total > 0 && (
                                  <Typography
                                    component="span"
                                    color="secondary"
                                    variant="subtitle2"
                                    style={{ marginLeft: '.5em' }}
                                  >
                                    {localizeNumber(total, t)}
                                  </Typography>
                                )}
                              </React.Fragment>
                            }
                            classes={{ root: classes.tab, wrapper: classes.tabWrapper }}
                          />
                        );
                      })}
                    </Tabs>
                  )}
                </FormSpy>
              </Grid>
            )}
            {selectedServiceRegionId && (
              <Grid item xs={clientServiceRegions.length > 1 ? 8 : 12}>
                <RegionalServicesContainer serviceRegionId={selectedServiceRegionId} />
              </Grid>
            )}
          </React.Fragment>
        ) : (
          <Grid item xs={12}>
            <Typography color="textSecondary">
              {t(
                'safetyPrograms.clientServiceRegions.organizationHasNoServiceRegions',
                'This organization has no service regions. Please select another option.'
              )}
            </Typography>
          </Grid>
        )}
      </GridContainer>
    );
  }
}

export const ClientServiceRegionsComponent = withStyles(styles)(withTranslation()(Component));
