import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from './editor';

class StringContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired
  };

  _save = () => {
    const value = this.refs.editor.value();

    this.props.save(value);
  };

  render() {
    return (
      <form keys>
        <box
          content={this.props.keyName}
          position={{ height: '5%' }}
          bold
        />
        <box position={{ height: '85%', top: '5%' }}>
          <Editor
            ref='editor'
            defaultValue={this.props.value} />
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
