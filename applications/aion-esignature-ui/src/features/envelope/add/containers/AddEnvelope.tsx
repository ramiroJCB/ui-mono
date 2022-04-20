import * as React from 'react';
import { AddEnvelopeBreadcrumbsContainer } from 'features/breadcrumbs/containers/AddEnvelopeBreadcrumbs';
import { AddEnvelopeComponent } from '../components/AddEnvelope';
import { addEnvelopeDocument } from '../actions/addEnvelopeDocument';
import { addEnvelopeIfNeeded } from '../actions/addEnvelope';
import { connect } from 'react-redux';
import { enqueueSnackbar } from '@pec/aion-ui-core/actions/enqueueSnackbar';
import { fetchTemplatesIfNeeded } from 'features/templates/actions/fetchTemplates';
import { FileWithPath } from 'react-dropzone';
import { FormApi } from 'final-form';
import { IAddEnvelopeForm } from 'interfaces/envelopeForm';
import { IDocumentWithStatus } from 'interfaces/documentWithStatus';
import { InvalidFileUpload } from 'interfaces/invalidFileUpload';
import { Loading } from '@pec/aion-ui-components/components/Loading';
import { NotistackSnackbar } from '@pec/aion-ui-core/interfaces/notistackSnackbar';
import { PageHeaderComponent } from 'components/PageHeader';
import { removePendingDocument } from 'features/envelope/actions/removePendingDocument';
import { RootActions } from 'combineActions';
import { RootState } from 'combineReducers';
import { RouteComponentProps } from 'react-router-dom';
import { ThunkDispatch } from 'redux-thunk';
import { I18nextProps } from '@pec/aion-ui-i18next/types/i18n';
import { withTranslation } from 'react-i18next';

type RouteProps = {
  organizationId: string;
};

type Props = RouteComponentProps<RouteProps> &
  ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps> &
  I18nextProps;

const mapStateToProps = (state: RootState) => ({ envelope: state.envelope, templates: state.templates });

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, null, RootActions>) => ({
  addEnvelopeDocument: (document: FileWithPath) => dispatch(addEnvelopeDocument(document)),
  addEnvelopeGroup: async (form: IAddEnvelopeForm) => dispatch(await addEnvelopeIfNeeded(form)),
  removePendingDocument: () => dispatch(removePendingDocument()),
  enqueueSnackbar: (snackbar: NotistackSnackbar) => dispatch(enqueueSnackbar(snackbar)),
  fetchTemplates: () => dispatch(fetchTemplatesIfNeeded())
});

class AddEnvelope extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    props.fetchTemplates();
  }

  componentWillUnmount() {
    this.props.removePendingDocument();
  }

  onSubmit = async (values: IAddEnvelopeForm) => {
    const {
      history,
      match: {
        params: { organizationId }
      }
    } = this.props;

    try {
      await this.props.addEnvelopeGroup(values);

      history.push(`/${organizationId}/esignatures/documents`);
    } catch (error) {}
  };

  uploadEnvelopeDocument = async (
    form: FormApi<IAddEnvelopeForm>,
    acceptedFiles: FileWithPath[],
    rejectedFiles: InvalidFileUpload[]
  ) => {
    const { enqueueSnackbar, t } = this.props;

    if ([...acceptedFiles, ...rejectedFiles].length > 1) {
      enqueueSnackbar({
        message: t(
          'eSignature.envelope.add.oneDocumentMayBeUploaded',
          'Only one document may be uploaded to an envelope.'
        ),
        options: {
          variant: 'error'
        }
      });
    } else if (acceptedFiles.length === 1) {
      const document = await this.props.addEnvelopeDocument(acceptedFiles[0]);

      form.change('document', document);
    }
  };

  removePendingDocument = (form: FormApi<IAddEnvelopeForm>, _document: IDocumentWithStatus) => {
    this.props.removePendingDocument();

    form.change('document', undefined);
  };

  render() {
    const {
      envelope: { pendingDocument },
      match: {
        params: { organizationId }
      },
      templates: { isFetching, templates },
      t
    } = this.props;
    return (
      <React.Fragment>
        <PageHeaderComponent
          breadcrumbs={<AddEnvelopeBreadcrumbsContainer />}
          title={t('eSignature.common.newDocument', 'New Document')}
        />
        {!isFetching ? (
          <AddEnvelopeComponent
            handleFileUpload={this.uploadEnvelopeDocument}
            organizationId={organizationId}
            handleRemoveDocument={this.removePendingDocument}
            handleSubmit={this.onSubmit}
            templates={templates}
            pendingDocument={pendingDocument}
          />
        ) : (
          <Loading />
        )}
      </React.Fragment>
    );
  }
}

export const AddEnvelopeContainer = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AddEnvelope));
