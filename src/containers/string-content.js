// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import KeyboardBindings from './keyboard-bindings';
import Loader from '../components/loader';
import MessageDialog from '../components/message-dialog';
import Editor from '../components/editor';
import ScrollableBox from '../components/scrollable-box';
import ThemedButton from '../components/themed-button';
import { withTheme } from '../contexts/theme-context';
import { operations } from '../modules/redux/string';

class StringContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    saveString: PropTypes.func.isRequired,
    loadString: PropTypes.func.isRequired
  };

  _saveValue = () => {
    const value = this.refs.editor.value();
    this.props.saveString(value)
      .then(() => this.refs.messageDialog.open());
  };

  _reload = () => {
    this.refs.stringContent.focus();
    this.props.loadString();
  };

  componentDidMount() {
    this.props.loadString();
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
              position={{ height: '8%' }}
              bold>
            </box>
            <ScrollableBox
              style={this.props.theme.box}
              position={{ top: '8%', height: '90%' }}>
              <KeyboardBindings bindings={[
                { key: 'C-r', handler: this._reload, description: 'Reload' }
              ]}>
                <Editor
                  ref='editor'
                  position={{
                    height: 30,
                    width: '95%'
                  }}
                  defaultValue={this.props.value} />
              </KeyboardBindings>
              <ThemedButton
                onClick={this._saveValue}
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
          <MessageDialog
            position={{ height: 8, left: 'center', top: 'center' }}
            text='Value was updated!'
            ref='messageDialog' />
        </box>
      );
    }
  }
}

const mapStateToProps = ({ string }) => ({
  isLoading: string.isLoading, 
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
