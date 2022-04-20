import * as React from 'react';
import { animated, config, Transition } from 'react-spring/renderprops.cjs';
import { Location } from 'history';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { WithTheme, withTheme } from '@material-ui/core/styles';

type Props = {
  children: (location: Location) => React.ReactNode;
} & RouteComponentProps<{}> &
  WithTheme;

const RouteTransitionComponent: React.FC<Props> = ({ location, children, theme }) => (
  <Transition
    native
    items={location}
    config={config.gentle}
    keys={location.pathname}
    from={{ opacity: 0 }}
    enter={{ opacity: 1 }}
    leave={{ opacity: 0, position: 'absolute' as const }}
  >
    {loc => style => (
      <animated.div style={{ ...style, width: '100%', height: '100%', padding: theme.spacing(2) }}>
        {children(loc)}
      </animated.div>
    )}
  </Transition>
);

export const RouteTransition = withTheme(withRouter(RouteTransitionComponent));
