import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from '../contexts/theme-context';

const PROGRESS_TEXTS = ['|', '/', '/', '-', '\\'];

class Loader extends Component {
  static propTypes = {
    text: PropTypes.string,
    theme: PropTypes.object.isRequired
  };
  state = { text: '' };

  _progressTextIndex = 0;

  componentDidMount() {
    this._timer = setInterval(() => this._showProgressText(), 200);
    this._showProgressText();
  }

  componentWillUnmount() {
    clearInterval(this._timer);
  }

  _showProgressText() {
    const progressText = PROGRESS_TEXTS[this._progressTextIndex % PROGRESS_TEXTS.length];
    this.setState({ text: `${progressText} ${this.props.text || 'loading...'}` })
    ++this._progressTextIndex;
  }

  render() {
    return (
      <box
        name='loader'
        width='100%'
        height={2}
        ref='loading'
        style={this.props.theme.loader}
        {...this.props}
        content={this.state.text}>
      </box>
    );
  }
}

export default withTheme(Loader);
