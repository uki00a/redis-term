import React, { Component } from 'react';
import PropTypes from 'prop-types';

class KeyContent extends Component {
  static propTypes = {
    value: PropTypes.any, 
    type: PropTypes.string,
    theme: PropTypes.object.isRequired
  };

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
          content={this.props.value}>
        </StringContent>
      );
    case 'list':
      return (
        <HashContent
          content={this.props.value}>
        </HashContent>
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
        style={theme.box.normal}
        border='line'>
        {
          this._renderContent()
        }
      </box>
    );
  }
}

// FIXME
const HashContent = ({ content }) => <text content={JSON.stringify(content)}></text>;
const StringContent = ({ content }) => <text>{content}</text>;
const ListContent = ({ content }) => <text content={JSON.stringify(content)}></text>;
const SetContent = ({ content }) => <text content={JSON.stringify(content)}></text>;
const ZsetContent = ({ content }) => <text content={JSON.stringify(content)}></text>;


export default KeyContent;
