import React, { Component } from 'react';
import { connect } from 'react-redux';
import ConfigForm from '../components/config-form';
import { connect as connectToRedis } from '../modules/connections';

const mapStateToProps = state => state;
const mapDispatchToProps = { connectToRedis };

class ConfigFormContainer extends Component {
  onSubmit = config => {
    this.props.connectToRedis(config);
  };
  render() {
    return <ConfigForm theme={this.props.theme} onSubmit={this.onSubmit}></ConfigForm>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigFormContainer);
