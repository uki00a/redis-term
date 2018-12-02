import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scanKeys } from '../modules/keys';

class Database extends Component {
  componentDidMount() {
    this.props.scanKeys();
  }

  render() {
    // FIXME
    return (
      <box content={this.props.keys.join(',')}>
      </box>
    );
  }
}

const mapStateToProps = state => ({ keys: state.keys });
const mapDispatchToProps = { scanKeys };

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Database);
