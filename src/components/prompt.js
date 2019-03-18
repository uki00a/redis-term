import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dialog from './dialog';
import ThemedButton from './themed-button';
import Textbox from './textbox';

class Prompt extends Component {
  static propTypes = {
    title: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = {
    isOpened: false
  };

  _onOk = () => {
    const value = this.refs.input.value();

    this.props.onOk(value);
    this.close();
  };

  _onCancel = () => {
    this.props.onCancel();
    this.close();
  };

  open() {
    this.setState({ isOpened: true });
  }

  close() {
    this.setState({ isOpened: false });
  }

  render() {
    const { title, onOk, onCancel, ...restProps } = this.props;

    return (
      <Dialog
        isOpened={this.state.isOpened}
        title={title}
        { ...restProps }>
        <Textbox
          position={{ top: 3, height: 1, left: 2, right: 2 }}
          bg='black'
          hoverBg='blue'
          ref='input'
        />
        <ThemedButton
          position={{ top: 5, height: 1, left: 2, width: 6 }}
          content='OK'
          align='center'
          onClick={this._onOk}
        />
        <ThemedButton
          position={{ top: 5, height: 1, left: 10, width: 8 }}
          content='Cancel'
          align='center'
          onClick={this._onCancel}
        />
      </Dialog>
    );
  }
}

export default Prompt;
