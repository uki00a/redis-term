import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from './editor';
import ScrollableBox from './scrollable-box';
import Button from './button';

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
      <box>
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
        <ScrollableBox position={{ top: '8%', height: '90%' }}>
          <Editor
            ref='editor'
            position={{
              height: 30,
              width: '95%'
            }}
            defaultValue={this.props.value} />
          <Button
            border='line'
            onClick={this._save}
            content='{center}Save{/center}'
            tags
            position={{
              top: 30,
              width: 8,
              height: 3
            }}>
          </Button>
        </ScrollableBox>
      </box>
    );
  }
}

export default StringContent;
