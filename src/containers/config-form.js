import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ConfigForm from '../components/config-form';
import { connect as connectToRedis } from '../modules/redux/connections';
import theme from '../theme';

const mapStateToProps = state => state;
const mapDispatchToProps = { connectToRedis };

class ConfigFormContainer extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };
  onSubmit = config => {
    this.props.connectToRedis(config);
    this.props.history.push('/database');
  };
  render() {
    return <ConfigForm theme={theme} onSubmit={this.onSubmit}></ConfigForm>;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfigFormContainer);
