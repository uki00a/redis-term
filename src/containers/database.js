import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scanKeys } from '../modules/keys';
import KeyList from '../components/key-list';
import theme from '../theme';

class Database extends Component {
  componentDidMount() {
    this.props.scanKeys();
  }

  render() {
    // FIXME
    return (
      <KeyList keys={this.props.keys} theme={theme}>
      </KeyList>
    );
  }
}

const mapStateToProps = state => ({ keys: state.keys });
const mapDispatchToProps = { scanKeys };

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Database);
