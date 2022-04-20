import * as React from 'react';
import Header from './Header';
import { Grid, Typography } from '@material-ui/core';
import { LinkingContainer } from 'containers/linkingContainer';
import { PECLinkTableContainer } from '../containers/PECLinkTable';
import { RouteComponentProps } from 'react-router';
import { VerisourceLinkTableContainer } from '../containers/verisourceLinkTable';
import { Trans } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';

type RouteParams = {
  organizationId: string;
};
type Props = RouteComponentProps<RouteParams> & I18nextProps;

type State = {
  isModalOpen: boolean;
};
class LinkEmployeesComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false
    };
  }

  setModal = (state: boolean) => this.setState({ isModalOpen: state });

  render() {
    const {
      match: {
        params: { organizationId },
        path
      },
      location: { search },
      history
    } = this.props;
    const { isModalOpen } = this.state;
    return (
      <React.Fragment>
        <Header organizationId={organizationId} path={path} />
        <LinkingContainer
          organizationId={organizationId}
          URLSearch={search}
          isModalOpen={isModalOpen}
          setModal={this.setModal}
        />
        <Grid container spacing={4} justify="space-around" direction="row">
          <Grid item xs={12} md={12} style={{ padding: '32px 16px 0px 16px' }}>
            <Typography>
              <Trans i18nKey="employee.linkEmployees.disclaimer">
                To begin matching employees, please select one from the list on the left below. If the employee you are
                looking for is not shown in the suggestions, try manually searching for them in the VeriSource list on
                the right.
              </Trans>
            </Typography>
          </Grid>
          <PECLinkTableContainer organizationId={organizationId} URLSearch={search} history={history} />
          <VerisourceLinkTableContainer URLSearch={search} history={history} setModal={this.setModal} />
        </Grid>
      </React.Fragment>
    );
  }
}

export const LinkEmployees = withTranslation()(LinkEmployeesComponent);
