import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

class Loader extends Component {
  static propTypes = {
    text: PropTypes.string,
    theme: PropTypes.object.isRequired
  };

  componentDidMount() {
    const loading = this.refs.loading;
    setImmediate(() => loading.load(this.props.text || 'loading...'));
  }

  componentWillUnmount() {
    const loading = this.refs.loading;
    setImmediate(() => loading.stop());
  }

  render() {
    return (
      <loading
        width='100%'
        height='20%'
        ref='loading'
        style={this.props.theme.loader}
        {...this.props}>
      </loading>
    );
  }
}

export default withTheme(Loader);
