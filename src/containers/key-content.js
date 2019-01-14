import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import StringContent from '../components/string-content';
import ListContent from '../components/list-content';

class KeyContent extends Component {
  static propTypes = {
    keyName: PropTypes.string,
    value: PropTypes.any, 
    type: PropTypes.string,
    theme: PropTypes.object.isRequired,
    redis: PropTypes.object.isRequired
  };

  _setKey = ({ key, value }) => this.props.redis.set(key, value);

  _renderContent() {
    switch (this.props.type) {
    case 'hash':
      return (
        <HashContent
          content={this.props.value}>
        </HashContent>
      );
    case 'string':
      return (
        <StringContent
          keyName={this.props.keyName}
          save={this._setKey}
          content={this.props.value}>
        </StringContent>
      );
    case 'list':
      return (
        <ListContent
          theme={this.props.theme}
          content={this.props.value}>
        </ListContent>
      );
    case 'set':
      return (
        <SetContent
          content={this.props.value}>
        </SetContent>
      );
    case 'zset':
      return (
        <ZsetContent
          content={this.props.value}>
        </ZsetContent>
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
        style={theme.box.normal}
        border='line'>
        {
          this._renderContent()
        }
      </box>
    );
  }
}

// FIXME Move components to separate files

const HashContent = ({ content }) => <text content={JSON.stringify(content)}></text>;

const SetContent = ({ content }) => <text content={JSON.stringify(content)}></text>;
const ZsetContent = ({ content }) => <text content={JSON.stringify(content)}></text>;

export default withRedis(KeyContent);
