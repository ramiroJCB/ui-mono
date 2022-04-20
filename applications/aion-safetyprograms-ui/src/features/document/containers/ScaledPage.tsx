import * as React from 'react';
import Page, { Props as PageProps } from 'react-pdf/dist/Page';
import { connect } from 'react-redux';
import { RootState } from 'combineReducers';

type OwnProps = Omit<PageProps, 'scale'>;

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

const mapStateToProps = ({ document: { scale } }: RootState) => ({
  scale
});

const Component: React.FC<Props> = props => <Page {...props} />;

export const ScaledPage = connect(mapStateToProps)(Component);
