import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import { withTheme } from '../contexts/theme-context';

class ConfigForm extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  onConnectButtonClicked = () => {
    this.refs.form.submit();
  };

  render() {
    const { theme } = this.props;

    return (
      <form
        keys
        ref='form'
        border='line'
        style={Object.assign({}, theme.box, theme.box.focus)}
        position={{ left: 1, right: 1, top: 0, bottom: 0 }}
        onSubmit={this.props.onSubmit}>
        <box
          style={theme.box}
          position={{ left: 1, right: 1, top: 1, bottom: 1, width: 36 }}>
          <box position={{ left: 0, top: 0, height: 2 }} style={theme.box}>
            <text
              content='Name:'
              style={theme.box}
              position={{ left: 0 }}>
            </text>
            <Textbox
              name='name'
              value='FIXME'
              position={{ left: 6, height: 1, width: 16 }}>
            </Textbox>
          </box>
          <box position={{ left: 0, top: 2, height: 2 }} style={theme.box}>
            <text
              content='Host:'
              style={theme.box}
              position={{ left: 0 }}
            ></text>
            <Textbox
              name='host'
              value='127.0.0.1'
              position={{ left: 6, height: 1, width: 16 }}>
            </Textbox>
          </box>
          <box position={{ left: 0, top: 4, height: 2 }} style={theme.box}>
            <text
              content='Port:'
              style={theme.box}
              position={{ left: 0 }}>
            </text>
            <Textbox
              name='port'
              value='6379'
              position={{ left: 6, height: 1, width: 16 }}>
            </Textbox>
          </box>
          <box position={{ left: 0, top: 6, height: 2 }} style={theme.box}>
            <text
              content='Password:'
              style={theme.box}
              position={{ left: 0 }}>
            </text>
            <Textbox
              name='password'
              value=''
              position={{ left: 10, height: 1, width: 16 }}>
            </Textbox>
          </box>
          <box position={{ left: 0, top: 8, height: 2 }} style={theme.box}>
            <ThemedButton
              position={{ left: 36, height: 1, width: 16 }}
              content=' Connect '
              onPress={this.onConnectButtonClicked}>
            </ThemedButton>
          </box>
        </box>
      </form>
    );
  }
}

export default withTheme(ConfigForm);
