import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConnectionForm from '../components/connection-form';

class ConnectionFormContainer extends Component {
  static propTypes = {
    connectToRedis: PropTypes.func.isRequired
  };

  onSubmit = config => {
    this.props.connectToRedis(config);
  };

  render() {
    return <ConnectionForm onSubmit={this.onSubmit}></ConnectionForm>;
  }
}

export default ConnectionFormContainer;
