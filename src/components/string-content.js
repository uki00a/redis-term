import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from './editor';

class StringContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired
  };

  _save = () => {
    const key = this.props.keyName;
    const value = this.refs.editor.value();

    this.props.save({ key, value });
  };

  render() {
    return (
      <form keys>
        <box position={{ height: '90%', top: 0 }}>
          <Editor
            ref='editor'
            defaultValue={this.props.content} />
        </box>
        <box position={{ height: '10%', top: '90%', bottom: 0, right: 0 }}>
          <button
            border='line'
            onClick={this._save}
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ width: 8, right: 2 }}>
          </button>
        </box>
      </form>
    );
  }
}

export default StringContent;
