import React, { Component } from 'react';
import { connect } from 'react-redux';
import { scanKeys, getKeyContent } from '../modules/database';
import KeyList from '../components/key-list';
import KeyContent from '../components/key-content';
import theme from '../theme';

class Database extends Component {
  onKeySelected = (item, keyIndex) => {
    const key = this.props.keys[keyIndex];

    this.props.getKeyContent(key);
  };

  componentDidMount() {
    this.props.scanKeys();
    this.refs.keyList.focus();
  }

  render() {
    // FIXME
    return (
      <box position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
        <box position={{ left: 0, top: 0, bottom: 0, width: 30 }}>
          <KeyList
            ref='keyList'
            keys={this.props.keys}
            theme={theme}
            onSelect={this.onKeySelected}>
          </KeyList>
        </box>
        <box position={{ left: 30, top: 0, right: 0 }}>
          <KeyContent
            type={this.props.keyContent.type}
            value={this.props.keyContent.value}
            theme={theme}>
          </KeyContent>
        </box>
      </box>
    );
  }
}

const mapStateToProps = state => ({
  keys: state.database.keys,
  keyContent: state.database.keyContent
});
const mapDispatchToProps = {
  scanKeys,
  getKeyContent
};

export default connect(
  mapStateToProps, 
  mapDispatchToProps
)(Database);
