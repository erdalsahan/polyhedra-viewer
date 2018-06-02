// @flow
import React, { PureComponent } from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';

import { fullScreen } from 'styles/common';

import { OperationProvider } from './OperationContext';
// TODO how to prevent needing both of these??
import { PolyhedronProvider, WithPolyhedron } from './PolyhedronContext';
import Sidebar from './Sidebar';
import Scene from './Scene';

const styles = StyleSheet.create({
  viewer: {
    ...fullScreen,
    display: 'flex',
    width: '100%',
  },
  sidebar: {
    position: 'relative',
    height: '100%',
  },
  scene: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '100%',
  },
});

interface ViewerProps {
  solid: string;
  history: any;
}

class Viewer extends PureComponent<*> {
  constructor(props: *) {
    super(props);
    const { solid, setPolyhedron } = props;
    setPolyhedron(solid);
  }

  componentDidUpdate(prevProps) {
    const { solid, panel, setPolyhedron } = this.props;

    // If an operation has not been applied and there is a mismatch betweeen the props and context,
    // update context
    // TODO is this janky?
    if (solid !== prevProps.solid && panel !== 'operations') {
      setPolyhedron(solid);
    }
  }

  render() {
    const { solid, panel } = this.props;
    return (
      <div className={css(styles.viewer)}>
        {panel !== 'full' && (
          <div className={css(styles.sidebar)}>
            <Sidebar panel={panel} solid={solid} />
          </div>
        )}
        <Scene panel={panel} solid={solid} />
      </div>
    );
  }
}

export default (props: ViewerProps) => (
  <PolyhedronProvider>
    <OperationProvider
      solid={props.solid}
      setSolid={name => props.history.push(`/${name}/operations`)}
    >
      <WithPolyhedron>
        {({ setPolyhedron }) => (
          <Viewer {...props} setPolyhedron={setPolyhedron} />
        )}
      </WithPolyhedron>
    </OperationProvider>
  </PolyhedronProvider>
);
