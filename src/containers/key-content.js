import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';
import StringContent from './string-content';
import ListContent from './list-content';
import HashContent from './hash-content';
import SetContent from './set-content';
import ZsetContent from './zset-content';

class KeyContent extends Component {
  static propTypes = {
    keyName: PropTypes.string,
    type: PropTypes.string,
    theme: PropTypes.object.isRequired,
    redis: PropTypes.object // TODO make this required
  };

  _renderContent() {
    switch (this.props.type) {
    case 'hash':
      return (
        <HashContent keyName={this.props.keyName} />
      );
    case 'string':
      return (
        <StringContent keyName={this.props.keyName} redis={this.props.redis} />
      );
    case 'list':
      return (
        <ListContent keyName={this.props.keyName} />
      );
    case 'set':
      return (
        <SetContent keyName={this.props.keyName} />
      );
    case 'zset':
      return (
        <ZsetContent keyName={this.props.keyName} />
      );
    default:
      return null;
    }
  }

  render() {
    const { theme } = this.props;

    return (
      <box
        position={{ top: 0, left: 0 }}
        style={theme.box}
        border='line'>
        {
          this._renderContent()
        }
      </box>
    );
  }
}

const mapStateToProps = ({ keys }) => {
  return {
    keyName: keys.selectedKeyName,
    type: keys.selectedKeyType
  };
};

export default connect(
  mapStateToProps  
)(withTheme(KeyContent));
