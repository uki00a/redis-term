import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Textbox from './textbox';
import ThemedButton from './themed-button';
import Dialog from './dialog';
import { withTheme } from '../contexts/theme-context';

class AddNewKeyDialog extends Component {
  static propTypes = {
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  };

  state = { isOpened: false };

  _onOk = () => {
    const keyName = this.refs.keyInput.value();
    const type = this._checkedType();
    this.props.onOk(keyName, type);
    this.close();
  };

  _onCancel = () => {
    this.close(() => this.props.onCancel());
  };

  open() {
    this.setState({ isOpened: true });
    this.refs.keyInput.focus();
  }

  close(callback) {
    this.setState({ isOpened: false }, () => {
      if (callback) setImmediate(callback);
    });
  }

  _checkedType() {
    const type = this.refs.types.children.find(x => x.checked);
    return type && type.name;
  }

  _renderTypeList() {
    const types = ['string', 'list', 'hash', 'set', 'zset'];
    const width = 12;
    return (
      <radioset
        style={this.props.theme.box}
        ref='types'
        position={{ top: 6, height: 2, left: 2, right: 2 }}>
        {
          types.map((type, i) => (
            <radiobutton 
              style={this.props.theme.box}
              key={type}
              keys
              clickable
              mouse
              name={type}
              position={{ top: 0, left: width * i }}
              checked={i === 0}
              content={type}
            />
          ))
        }
      </radioset>
    );
  }

  render() {
    return (
      <Dialog
        title='Add New Key'
        isOpened={this.state.isOpened}>
        <text
          style={this.props.theme.box}
          content='Key:'
          position={{ top: 3, height: 1, left: 2, right: 2 }}
        />
        <Textbox
          style={this.props.theme.textbox}
          name='keyName'
          position={{ top: 4, height: 1, left: 2, right: 2 }}
          name='keyInput'
          bg='black'
          hoverBg='blue'
          ref='keyInput'
        />
        <text
          style={this.props.theme.box}
          content='Type:'
          position={{ top: 5, height: 1, left: 2, right: 2}}
        />
        { this._renderTypeList() }
        <ThemedButton
          position={{ top: 9, height: 1, left: 2, width: 6 }}
          content='OK'
          align='center'
          onClick={this._onOk}
        />
        <ThemedButton
          position={{ top: 9, height: 1, left: 10, width: 8 }}
          content='Cancel'
          align='center'
          onClick={this._onCancel}
        />
      </Dialog>
    );
  }
}

export default withTheme(AddNewKeyDialog);
