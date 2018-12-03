import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scanKeys } from '../modules/keys';
import KeyList from '../components/key-list';
import KeyContent from '../components/key-content';
import theme from '../theme';

class Database extends Component {
  componentDidMount() {
    this.props.scanKeys();
  }

  render() {
    // FIXME
    return (
      <box position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
        <box position={{ left: 0, top: 0, bottom: 0, width: 30 }}>
          <KeyList keys={this.props.keys} theme={theme}>
          </KeyList>
        </box>
        <box position={{ left: 30, top: 0, right: 0 }}>
          <KeyContent content='test' theme={theme}>
          </KeyContent>
        </box>
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
