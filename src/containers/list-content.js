// @ts-check
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from '../components/loader';
import Prompt from '../components/prompt';
import Editor from '../components/editor';
import List from '../components/list';
import ScrollableBox from '../components/scrollable-box';
import KeyboardBindings from './keyboard-bindings';
import { withTheme } from '../contexts/theme-context';
import { operations } from '../modules/redux/list';


class ListContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    elements: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    addElementToList: PropTypes.func.isRequired,
    loadListElements: PropTypes.func.isRequired,
    updateListElement: PropTypes.func.isRequired
  };

  state = { editingElementIndex: null };

  _openAddElementPrompt = () => {
    this.refs.addElementPrompt.open();
  };

  _closeAddElementPrompt = () => {
    this.refs.addElementPrompt.close();
    this._focusToElementList();
  };

  _onSelect = (item, index) => {
    this.setState({ editingElementIndex: index });
  };

  _addElement = element => {
    this.props.addElementToList(element)
      .then(() => this._focusToElementList());
  };

  _reload = () => {
    this.props.loadListElements()
      .then(() => this._focusToElementList());
  };

  _editingElementValue() {
    return this.state.editingElementIndex == null
      ? null
      : this.props.elements[this.state.editingElementIndex];
  }

  _saveEditingElement = () => {
    if (this.state.editingElementIndex == null) {
      return;
    }
    const index = this.state.editingElementIndex;
    const value = this.refs.editor.value();
    this.props.updateListElement(index, value)
      .then(() => this._focusToElementList());
  };

  _focusToElementList() {
    this.refs.elementList.focus();
  }

  componentDidUpdate(prevProps) {
    if (this.props.keyName !== prevProps.keyName) {
      this.props.loadListElements();
    }
  }

  componentDidMount() {
    this.props.loadListElements();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    }
    
    return (
      <box ref='box' style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={`LIST: ${this.props.keyName}`}
          position={{ height: 1 }}
          bold
        />
        <KeyboardBindings bindings={[
          { key: 'C-r', handler: this._reload, description: 'Reload' },
          { key: 'a', handler: this._openAddElementPrompt, description: 'Add Element' }
        ]}>
          <List
            ref='elementList'
            items={this.props.elements}
            position={{ width: '50%', top: 1 }}
            onSelect={this._onSelect}
          />
        </KeyboardBindings>
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
          <KeyboardBindings bindings={[
            { key: 'C-s', handler: this._saveEditingElement, description: 'Save' }
          ]}>
            <Editor
              ref='editor'
              defaultValue={this._editingElementValue()}
              disabled={this.state.editingElementIndex == null}
              position={{ height: 30, width: '95%' }}
            />
          </KeyboardBindings>
          <Loader
            text='saving...'
            top={30}
            hidden={!this.props.isSaving}
          />
        </ScrollableBox>
        <Prompt
          ref='addElementPrompt'
          title='Add Element'
          onOk={this._addElement}
          onCancel={this._closeAddElementPrompt}
        />
      </box>
    );   
  }
}

const mapStateToProps = state => state.list;
const mapDispatchToProps = {
  loadListElements: operations.loadListElements,
  addElementToList: operations.addElementToList,
  updateListElement: operations.updateListElement
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(ListContentContainer));
