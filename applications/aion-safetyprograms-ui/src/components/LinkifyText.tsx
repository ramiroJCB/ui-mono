import * as React from 'react';
import Link from '@material-ui/core/Link';
import Linkify from 'react-linkify';

export const LinkifyText: React.FC = ({ children }) => {
  const componentDecorator = (href: string, text: string, key: number) => (
    <Link href={href} key={key} target="_blank" rel="noopener noreferrer">
      {text}
    </Link>
  );
  return <Linkify componentDecorator={componentDecorator}>{children}</Linkify>;
};
