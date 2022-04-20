import React from 'react';
import { Link } from '@pec/aion-ui-components/components/Link';
import LaunchIcon from '@material-ui/icons/Launch';

type Props = {
  label: string;
  url: string;
};
export const ExternalLink: React.FC<Props> = ({ label, url }) => (
  <Link
    style={{ textDecoration: 'none', alignItems: 'center', display: 'inline-flex' }}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
  >
    {label}
    <LaunchIcon fontSize="small" color="primary" style={{ alignSelf: 'center', marginLeft: 3, fontSize: 'smaller' }} />
  </Link>
);
