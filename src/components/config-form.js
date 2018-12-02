import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ConfigForm extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  onConnectButtonClicked = () => {
    this.refs.form.submit();
  };

  render() {
    const { theme } = this.props;
    const style = Object.assign({}, theme.box.normal, theme.box.focus);
    const textboxWidth = 16;

    return (
      <box
        border='line'
        style={style}
        position={{ left: 1, right: 1, top: 0, bottom: 0 }}>
        <form
          keys
          ref='form'
          style={style}
          position={{ left: 1, right: 1, top: 1, bottom: 1 }}
          onSubmit={this.props.onSubmit}>
          <box position={{ left: 0, top: 0, height: 2 }} style={style}>
            <text
              content='Name:'
              style={style}
              position={{ left: 0 }}>
            </text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='name'
              value='FIXME'
              position={{ left: 6, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 2, height: 2 }} style={style}>
            <text
              content='Host:'
              style={style}
              position={{ left: 0 }}
            ></text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='host'
              value='127.0.0.1'
              position={{ left: 6, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 4, height: 2 }} style={style}>
            <text
              content='Port:'
              style={style}
              position={{ left: 0 }}>
            </text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='port'
              value='6379'
              position={{ left: 6, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 6, height: 2 }} style={style}>
            <text
              content='Password:'
              style={style}
              position={{ left: 0 }}>
            </text>
            <textbox
              keys
              inputOnFocus
              mouse
              name='password'
              value=''
              position={{ left: 10, height: 1, width: 16 }}>
            </textbox>
          </box>
          <box position={{ left: 0, top: 8, height: 2 }} style={style}>
            <button
              keys
              mouse
              position={{ left: 36, height: 1, width: 16 }}
              style={theme.button}
              content=' Connect '
              onPress={this.onConnectButtonClicked}>
            </button>
          </box>
        </form>
      </box>
    );
  }
}