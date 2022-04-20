import React from 'react';
import { Link } from '@pec/aion-ui-components/components/Link';

export const OshaLink = (number: number): React.ReactElement => (
  <Link
    style={{ textDecoration: 'none' }}
    href={`https://www.osha.gov/pls/imis/InspectionNr.search?id=${number}`}
    target="_blank"
    rel="noopener noreferrer"
    children={number}
  />
);
