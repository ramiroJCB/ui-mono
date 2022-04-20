import * as React from 'react';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import { AsyncDialog } from '@pec/aion-ui-components/components/AsyncDialog';
import { connect } from 'react-redux';
import { downloadEnvelopeDocumentIfNeeded } from '../actions/downloadEnvelopeDocument';
import { EnvelopeBreadcrumbsContainer } from 'features/breadcrumbs/containers/EnvelopeBreadcrumbs';
import { EnvelopeComponent } from '../components/Envelope';
import { EnvelopeStatus } from '@pec/aion-ui-core/interfaces/envelope';
import { fetchEnvelopeIfNeeded } from '../actions/fetchEnvelope';
import { IEnvelopeDocument } from '@pec/aion-ui-core/interfaces/envelopeDocument';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { OrganizationFeature } from '@pec/aion-ui-core/interfaces/organization';
import { PageHeaderComponent } from 'components/PageHeader';
import { parse } from '@pec/aion-ui-core/helpers/querystring';
import { removeEnvelope } from '../actions/removeEnvelope';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { signEnvelopeIfNeeded } from '../actions/signEnvelope';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

const { AssigneeAssigned, OwnerAssigned } = EnvelopeStatus;

type RouteParams = {
  envelopeId: string;
  organizationId: string;
};

type Props = RouteComponentProps<RouteParams> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  I18nextProps;

type State = {
  anchorEl: HTMLElement | ((element: HTMLElement) => HTMLElement) | undefined | null;
  showSignDialog: boolean;
  processingSignature: boolean;
  refreshTimeout: NodeJS.Timeout | null;
};

const mapStateToProps = (state: RootState) => ({ ...state.envelope, ...state.organization });

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, null, RootActions>,
  {
    match: {
      params: { envelopeId }
    }
  }: RouteComponentProps<RouteParams>
) => ({
  downloadEnvelopeDocumentIfNeeded: (document: IEnvelopeDocument) =>
    dispatch(downloadEnvelopeDocumentIfNeeded(document)),
  fetchEnvelopeIfNeeded: () => dispatch(fetchEnvelopeIfNeeded(envelopeId)),
  removeEnvelope: () => dispatch(removeEnvelope()),
  signEnvelopeIfNeeded: () => dispatch(signEnvelopeIfNeeded(envelopeId))
});

class Envelope extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    props.fetchEnvelopeIfNeeded();

    this.state = {
      anchorEl: null,
      showSignDialog: false,
      processingSignature: false,
      refreshTimeout: null
    };
  }

  componentDidUpdate() {
    const {
      envelope,
      location: { search },
      organization
    } = this.props;
    const { processingSignature } = this.state;
    const { event } = parse(search);

    const isClientOrg = organization && organization.features.includes(OrganizationFeature.Client) ? true : false;

    const shouldRefreshEnvelopeStatus =
      envelope !== null &&
      ((!isClientOrg && envelope.status === AssigneeAssigned) || (isClientOrg && envelope.status === OwnerAssigned)) &&
      (event === 'ttl_expired' || event === 'signing_complete');

    if (shouldRefreshEnvelopeStatus) {
      const timeout = setTimeout(() => this.props.fetchEnvelopeIfNeeded(), 5000);

      if (!processingSignature) {
        this.setState({ processingSignature: true, refreshTimeout: timeout });
      }
    } else if (!shouldRefreshEnvelopeStatus && processingSignature) {
      this.setState({ processingSignature: false }, () => {
        this.clearRefreshTimeout();
      });
    }
  }

  componentWillUnmount() {
    this.props.removeEnvelope();
    this.clearRefreshTimeout();
  }

  clearRefreshTimeout = () => {
    const { refreshTimeout } = this.state;

    if (refreshTimeout) {
      window.clearTimeout(refreshTimeout);
    }
  };

  toggleSignDialog = () => {
    this.setState(prevState => ({ showSignDialog: !prevState.showSignDialog }));
  };

  handleConfirmSign = async () => {
    const url = await this.props.signEnvelopeIfNeeded();

    if (url) {
      window.location.assign(url);
    }
  };

  downloadDocument = async (document: IEnvelopeDocument) => {
    const { envelope } = this.props;

    if (envelope) {
      this.props.downloadEnvelopeDocumentIfNeeded(document);
    }
  };

  openDownloadMenu = (event: React.MouseEvent<Element, MouseEvent>) => {
    this.setState({ anchorEl: event.currentTarget as HTMLElement });
  };

  closeDownloadMenu = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { downloadingDocumentIds, envelope, isFetching, organization, t } = this.props;
    const { showSignDialog, anchorEl, processingSignature } = this.state;

    const documentName =
      envelope && envelope.documents[0] ? envelope.documents[0].fileName : t('eSignature.common.na', 'N/A');

    const isClientOrg = organization && organization.features.includes(OrganizationFeature.Client) ? true : false;

    return envelope && (!isFetching || processingSignature) ? (
      <React.Fragment>
        <PageHeaderComponent breadcrumbs={<EnvelopeBreadcrumbsContainer />} title={documentName} />
        <EnvelopeComponent
          downloadDocument={this.downloadDocument}
          envelope={envelope}
          signDocument={this.toggleSignDialog}
          isClientOrg={isClientOrg}
          downloadMenuAnchorEl={anchorEl}
          closeDownloadMenu={this.closeDownloadMenu}
          openDownloadMenu={this.openDownloadMenu}
          downloadingDocumentIds={downloadingDocumentIds}
          processingSignature={processingSignature}
        />
        <AsyncDialog open={showSignDialog} onClose={this.toggleSignDialog} asyncAction={this.handleConfirmSign}>
          <DialogContent>
            <Typography>
              {t(
                'eSignature.envelope.view.signDocumentConfirmation',
                'To sign this document, you will be navigated away from our site to Docusign. Are you sure you want to continue?'
              )}
            </Typography>
          </DialogContent>
        </AsyncDialog>
      </React.Fragment>
    ) : (
      <Loading />
    );
  }
}

export const EnvelopeContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Envelope));
