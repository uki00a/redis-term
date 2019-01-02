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

  open() {
    this.setState({ isOpened: true });
  }

  close() {
    this.setState({ isOpened: false });
  }

  _showPrompt() {
    setTimeout(() => { // FIXME Workaround for a timing issue
      const title = this.props.title || '';
      const initialValue = '';

      this.refs.prompt.readInput(title, initialValue, (err, value) => {
        this.close();

        if (err || value === null) {
          this.props.onCancel();
        } else {
          this.props.onOk(value);
        }
      });
    }, 250);
  }

  componentDidUpdate() {
    if (this.state.isOpened) {
      this._showPrompt();
    }
  }

  render() {
    return this.state.isOpened ? (
      <prompt
        ref='prompt'
        style={this.props.theme.prompt}
        border='line'
      />
    ) : <box hidden />;
  }
}

export default Prompt;
