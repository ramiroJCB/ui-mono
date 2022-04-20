import * as React from 'react';
import { Breadcrumbs } from '@pec/aion-ui-components/components/Breadcrumbs';
import { IBreadcrumbLink } from '@pec/aion-ui-core/interfaces/breadcrumbLink';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type RouteParams = {
  organizationId: string;
};

type Props = RouteComponentProps<RouteParams>;

const AddEnvelopeBreadcrumbs: React.FC<Props> = ({
  match: {
    params: { organizationId }
  }
}) => {
  const { t } = useTranslation();

  const links: IBreadcrumbLink[] = [
    {
      to: { pathname: `/${organizationId}/esignatures/documents` },
      label: t('eSignature.common.eSignatures', 'eSignatures')
    },
    {
      to: { pathname: `/${organizationId}/esignatures/documents/add` },
      label: t('eSignature.common.newDocument', 'New Document')
    }
  ];

  return <Breadcrumbs links={links.map((link, i) => ({ ...link, i }))} />;
};

export const AddEnvelopeBreadcrumbsContainer = withRouter(AddEnvelopeBreadcrumbs);
