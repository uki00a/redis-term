import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from './editor';

class StringContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired
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
          position={{ height: '8%' }}
          bold>
          <button
            border='line'
            onClick={this.props.reload}
            keys
            mouse
            content='{center}Reload{/center}'
            tags
            position={{ width: 8, right: 2, height: 3 }}
          />
        </box>
        <box position={{ height: '84%', top: '8%' }}>
          <Editor
            ref='editor'
            defaultValue={this.props.value} />
        </box>
        <box position={{ height: '8%', top: '92%', bottom: 0, right: 0 }}>
          <button
            border='line'
            onClick={this._save}
            keys
            mouse
            content='{center}Save{/center}'
            tags
            position={{ width: 8, right: 2, height: 3 }}>
          </button>
        </box>
      </form>
    );
  }
}

export default StringContent;
