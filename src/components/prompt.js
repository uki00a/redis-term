import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Prompt extends Component {
  static propTypes = {
    theme: PropTypes.object.isRequired,
    title: PropTypes.string,
    onOk: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = {
    isOpened: false
  };

  _onOk = () => {
    const value = this.refs.input.value;

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
    return (
      <box
        content={this.props.title}
        style={this.props.theme.dialog}
        border='line'
        hidden={!this.state.isOpened}>
        <textarea
          position={{ top: 3, height: 1, left: 2, right: 2 }}
          inputOnFocus
          input
          keyable
          clickable
          keys
          mouse
          bg='black'
          hoverBg='blue'
          ref='input'
        />
        <button
          position={{ top: 5, height: 1, left: 2, width: 6 }}
          content='OK'
          align='center'
          bg='black'
          hoverBg='blue'
          mouse
          clickable
          onClick={this._onOk}
        />
        <button
          position={{ top: 5, height: 1, left: 10, width: 8 }}
          shrink
          content='Cancel'
          align='center'
          bg='black'
          hoverBg='blue'
          mouse
          clickable
          onClick={this._onCancel}
        />
      </box>
    );
  }
}

export default Prompt;
