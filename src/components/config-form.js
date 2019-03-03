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
    const boxStyle = Object.assign({}, theme.box, theme.box.focus);

    return (
      <form
        keys
        ref='form'
        border='line'
        style={boxStyle}
        position={{ left: 1, right: 1, top: 0, bottom: 0 }}
        onSubmit={this.props.onSubmit}>
        <box
          label='Database'
          border='line'
          style={theme.box}
          width={36}
          height={18}>
          <box position={{ left: 1, right: 1, top: 1, bottom: 1 }} style={theme.box}>
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
                position={{ left: 0 }}>
              </text>
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
          </box>
        </box>
        <box
          label='SSL'
          border='line'        
          position={{ left: 36, top: 0, height: 14 }}
          style={theme.box}>
          <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
            <box position={{ left: 0, top: 0, height: 2 }} style={theme.box}>
              <text
                content='Private Key:'
                style={theme.box}
                position={{ left: 0 }}>
              </text>
              <Textbox
                name='tlskey'
                value=''
                position={{ left: 14, height: 1, width: 16 }}>
              </Textbox>
            </box>
            <box position={{ left: 0, top: 2, height: 2 }} style={theme.box}>
              <text
                content='Certificate:'
                style={theme.box}
                position={{ left: 0 }}>
              </text>
              <Textbox
                name='tlscert'
                value=''
                position={{ left: 14, height: 1, width: 16 }}>
              </Textbox>
            </box>
            <box position={{ left: 0, top: 4, height: 2 }} style={theme.box}>
              <text
                content='CA:'
                style={theme.box}
                position={{ left: 0 }}>
              </text>
              <Textbox
                name='tlscert'
                value=''
                position={{ left: 14, height: 1, width: 16 }}>
              </Textbox>
            </box>
          </box>
        </box>
        <box 
          border='line'
          position={{ left: 36, top: 14, height: 4 }}
          style={theme.box}>
          <box position={{ left: 1, top: 1, height: 1, right: 1 }} style={theme.box}>
            <ThemedButton
              position={{ height: 1, width: 16 }}
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
