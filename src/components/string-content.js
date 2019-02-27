import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from './editor';
import ScrollableBox from './scrollable-box';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

class StringContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    save: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  };

  _save = () => {
    const value = this.refs.editor.value();

    this.props.save(value);
  };

  render() {
    return (
      <box style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={this.props.keyName}
          position={{ height: '8%' }}
          bold>
          <ThemedButton
            onClick={this.props.reload}
            content='{center}Reload{/center}'
            tags
            position={{ width: 8, right: 2, height: 1 }}
          />
        </box>
        <ScrollableBox
          style={this.props.theme.box}
          position={{ top: '8%', height: '90%' }}>
          <Editor
            ref='editor'
            position={{
              height: 30,
              width: '95%'
            }}
            defaultValue={this.props.value} />
          <ThemedButton
            onClick={this._save}
            content='{center}Save{/center}'
            tags
            position={{
              top: 30,
              left: 1,
              width: 8,
              height: 1
            }}>
          </ThemedButton>
        </ScrollableBox>
      </box>
    );
  }
}

export default withTheme(StringContent);
