import * as React from 'react';
import Link, { LinkProps } from '@material-ui/core/Link';
import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';

export type Props = LinkProps & NavLinkProps;

export const NavLink: React.FC<Props> = props => <Link component={RouterNavLink as any} {...props} />;
