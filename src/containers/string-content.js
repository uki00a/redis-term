// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import KeyboardBindings from './keyboard-bindings';
import Loader from '../components/loader';
import MessageDialog from '../components/message-dialog';
import Editor from '../components/editor';
import ScrollableBox from '../components/scrollable-box';
import { withTheme } from '../contexts/theme-context';
import { operations } from '../modules/redux/string';

class StringContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    saveString: PropTypes.func.isRequired,
    loadString: PropTypes.func.isRequired
  };

  _saveValue = () => {
    const value = this.refs.editor.value();
    this.props.saveString(value);
  };

  _reload = () => {
    this.refs.stringContent.focus();
    this.props.loadString()
      .then(() => this._focusToEditor());
  };

  _focusToEditor() {
    this.refs.editor.focus();
  }

  componentDidMount() {
    this.props.loadString();
  }

  componentDidUpdate(prevProps) {
    if (this.props.keyName !== prevProps.keyName) {
      this.props.loadString();
    }
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    } else {
      return (
        <box ref='stringContent'>
          <box style={this.props.theme.box}>
            <box
              style={this.props.theme.box}
              content={this.props.keyName}
              position={{ height: 1 }}
              bold>
            </box>
            <ScrollableBox
              style={this.props.theme.box}
              position={{ top: 1, height: 30 }}>
              <KeyboardBindings bindings={[
                { key: 'C-r', handler: this._reload, description: 'Reload' },
                { key: 'C-s', handler: this._saveValue, description: 'Save' }
              ]}>
                <Editor
                  ref='editor'
                  position={{
                    height: 30,
                    width: '95%'
                  }}
                  defaultValue={this.props.value} />
              </KeyboardBindings>
            </ScrollableBox>
            <Loader
              text='saving...'
              top={32}
              hidden={!this.props.isSaving} />
          </box>
        </box>
      );
    }
  }
}

const mapStateToProps = ({ string }) => ({
  isLoading: string.isLoading, 
  isSaving: string.isSaving,
  value: string.value
});
const mapDispatchToProps = {
  saveString: operations.saveString,
  loadString: operations.loadString
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(StringContentContainer));
