import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfigForm from '../components/config-form';

class ConfigFormContainer extends Component {
  static propTypes = {
    connectToRedis: PropTypes.func.isRequired
  };
  onSubmit = config => {
    this.props.connectToRedis(config);
  };
  render() {
    return <ConfigForm onSubmit={this.onSubmit}></ConfigForm>;
  }
}

export default ConfigFormContainer;
