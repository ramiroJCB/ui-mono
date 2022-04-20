import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { DeepReadonly } from 'utility-types';
import { DialogTransition } from '@pec/aion-ui-components/components/DialogTransition';
import { DisplayPeriodStatus, IContractorPeriod } from 'interfaces/contractorPeriod';
import { FieldArray, GenericFieldArray } from 'redux-form';
import { IMappedMetric } from 'interfaces/mappedMetric';
import { IRegionalMetric } from 'interfaces/regionalMetric';
import { MetricValueType } from 'interfaces/metricValue';
import { OwnProps as FieldArrayCustomProps } from './RegionFields';
import { RegionFieldsComponent } from './RegionFields';
import TableContainer from '@material-ui/core/TableContainer';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    container: {
      paddingBottom: 6,
      height: 'calc(100vh - 285px)'
    },
    table: {
      '& th': {
        minWidth: 160,
        padding: '4px 24px'
      },
      '& th:not(:last-child), & td:not(:last-child)': {
        borderRight: `1px solid ${theme.palette.divider}`
      },
      '& thead th': {
        position: 'sticky',
        top: 0,
        backgroundColor: theme.palette.common.white,
        'z-index': 1
      },
      '& tbody th': {
        position: 'sticky',
        left: 0,
        'z-index': 2,
        backgroundColor: theme.palette.common.white
      }
    }
  });

type OwnProps = {
  isFetching: boolean;
  metrics: DeepReadonly<IRegionalMetric[]>;
  status: DisplayPeriodStatus;
  selectedPeriod: IContractorPeriod;
  updateBooleanMetricValue: (metric: IMappedMetric) => void;
  updateDoubleMetricValue: (metric: IMappedMetric) => void;
};

type Props = WithStyles<typeof styles> & OwnProps & I18nextProps;

type State = {
  metric?: IMappedMetric;
  reset: () => void;
};

const FieldArrayCustom = FieldArray as new () => GenericFieldArray<IRegionalMetric, FieldArrayCustomProps>;

class ContractorRegionalTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      metric: undefined,
      reset: () => {}
    };
  }

  handleClose = () => {
    this.state.reset();
    this.setState({
      metric: undefined
    });
  };

  handleOpen = (metric: IMappedMetric, reset: () => void) => {
    if (metric.requiresConfirmation) {
      this.setState({
        metric,
        reset
      });
    } else {
      this.props.updateDoubleMetricValue(metric);
    }
  };

  handleConfirm = () => {
    const { metric } = this.state;

    if (metric) {
      this.props.updateDoubleMetricValue(metric);
      this.setState({
        metric: undefined
      });
    }
  };

  render() {
    const { classes, isFetching, metrics, status, updateBooleanMetricValue, selectedPeriod, t } = this.props;

    return (
      <React.Fragment>
        <Dialog
          TransitionComponent={DialogTransition}
          open={this.state.metric !== undefined}
          onClose={this.handleClose}
          aria-describedby="confirm-change-value-description"
        >
          <DialogContent>
            {this.state.metric && (
              <DialogContentText id="confirm-change-value-description">
                {this.state.metric.value
                  ? t('reporting.regional.contractor.metricValueCorrectConfirmation', {
                      name: this.state.metric.name,
                      value: this.state.metric.value,
                      defaultValue: 'Are you sure {{value}} is the correct value for {{name}}?'
                    })
                  : t('reporting.regional.contractor.clearValueConfirmation', {
                      name: this.state.metric.name,
                      defaultValue: 'Are you sure you want to clear the value for {{name}}?'
                    })}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              {t('reporting.common.cancel', 'Cancel')}
            </Button>
            <Button color="primary" variant="contained" onClick={this.handleConfirm}>
              {t('reporting.regional.contractor.yesSaveIt', 'Yes, save it')}
            </Button>
          </DialogActions>
        </Dialog>
        <Paper className={classes.root}>
          <TableContainer className={classes.container}>
            <Table stickyHeader className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ zIndex: 3 }}>{t('reporting.common.location', 'Location')}</TableCell>
                  {metrics.map(({ id: metricId, name: metricName, valueType }) => (
                    <TableCell
                      style={{ textAlign: valueType === MetricValueType.Boolean ? 'center' : 'right' }}
                      key={metricId}
                    >
                      {metricName}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <FieldArrayCustom
                  isFetching={isFetching}
                  name="regions"
                  component={RegionFieldsComponent}
                  status={status}
                  selectedPeriod={selectedPeriod}
                  updateBooleanMetricValue={updateBooleanMetricValue}
                  confirmDoubleMetricValueChange={this.handleOpen}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </React.Fragment>
    );
  }
}

export const ContractorRegionalTableComponent = withStyles(styles)(withTranslation()(ContractorRegionalTable));
