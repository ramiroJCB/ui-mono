import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ClientRegionalRowDetailsContainer } from '../containers/ClientRegionalRowDetails';
import { IMetricContractor } from 'interfaces/metricContractor';
import { PeriodIconComponent } from 'components/PeriodIcon';
import { PeriodStatus } from 'interfaces/contractorPeriod';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';
import { localizeDate, localizeNumber, localizeTime } from '@pec/aion-ui-i18next/helpers/localize';
import { formats } from '@pec/aion-ui-i18next/constants';

const styles = (theme: Theme) => ({
  details: {
    padding: 0,
    justifyContent: 'center'
  },
  summary: {
    '&:hover': {
      background: theme.palette.action.hover
    }
  },
  editLabel: {
    marginLeft: '0.75em',
    color: theme.palette.text.disabled
  }
});

type OwnProps = {
  contractor: IMetricContractor;
  showTotal: boolean;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  expanded: boolean;
};

class ClientRegionalRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleOnChange = (_event: React.ChangeEvent<{}>, expanded: boolean) => this.setState({ expanded });

  render() {
    const { expanded } = this.state;
    const { contractor, classes, showTotal, t } = this.props;
    const {
      displayMetricStatus,
      isEditedAfterDeadline,
      metricStatus,
      metricValuesTotal,
      name,
      metricStatusUpdatedDateUtc
    } = contractor;
    const hasSubmittedEdits = isEditedAfterDeadline && metricStatus === PeriodStatus.Submitted;

    return (
      <Accordion onChange={this.handleOnChange}>
        <AccordionSummary className={classes.summary} expandIcon={<ExpandMoreIcon />}>
          <Grid container spacing={3} justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body1">
                {displayMetricStatus && <PeriodIconComponent status={displayMetricStatus} />}
                {name}
                {metricStatusUpdatedDateUtc && (
                  <small className={classes.editLabel}>
                    {t('reporting.regional.client.uploaded', {
                      date: localizeDate(metricStatusUpdatedDateUtc, t, formats.dateMedium),
                      time: localizeTime({ time: metricStatusUpdatedDateUtc }, t),
                      defaultValue: 'Updated {{date}} {{time}}'
                    })}
                  </small>
                )}
                {hasSubmittedEdits && (
                  <small className={classes.editLabel}>{t('reporting.regional.client.edited', '(Edited)')}</small>
                )}
              </Typography>
            </Grid>
            {showTotal && (
              <Grid item xs={2}>
                <Typography variant="body1" align="right">
                  {localizeNumber(metricValuesTotal, t)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <ClientRegionalRowDetailsContainer contractor={contractor} expanded={expanded} showTotal={showTotal} />
        </AccordionDetails>
      </Accordion>
    );
  }
}

export const ClientRegionalRowComponent = withStyles(styles)(withTranslation()(ClientRegionalRow));
