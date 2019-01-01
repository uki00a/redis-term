import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { set } from '../modules/redux/database';
import StringContent from '../components/string-content';

class KeyContent extends Component {
  static propTypes = {
    keyName: PropTypes.string,
    value: PropTypes.any, 
    type: PropTypes.string,
    theme: PropTypes.object.isRequired,

    set: PropTypes.func.isRequired
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
          keyName={this.props.keyName}
          save={this.props.set}
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

const ListContent = ({ content }) => <text content={JSON.stringify(content)}></text>;
const SetContent = ({ content }) => <text content={JSON.stringify(content)}></text>;
const ZsetContent = ({ content }) => <text content={JSON.stringify(content)}></text>;

const mapStateToProps = state => ({});
const mapDispatchToProps = {
  set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyContent);
