import React, { Component } from 'react';
import List from './list';
import Editor from './editor';
import PropTypes from 'prop-types';
import AddHashFieldDialog from './add-hash-field-dialog';
import ScrollableBox from './scrollable-box';
import FilterableList from './filterable-list';
import ThemedButton from './themed-button';
import CofnfirmationDialog from './confirmation-dialog';
import { withTheme } from '../contexts/theme-context';

class HashContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    hash: PropTypes.object.isRequired,
    addField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    saveField: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    filterFields: PropTypes.func.isRequired,
    lastPattern: PropTypes.string,
    theme: PropTypes.object.isRequired
  };

  state = { selectedFieldIndex: null };

  _addField = (field, value) => this.props.addField(field, value);

  _openAddHashFieldDialog = () => {
    this.refs.addHashFieldDialog.open();
  };

  _openConfirmationDialog = () => {
    this.refs.confirmationDialog.open();
  };

  _removeSelectedFieldIfExists = () => {
    if (!this._hasSelectedField()) {
      return;
    }
    this._removeSelectedField();
  };

  _removeSelectedField = () => {
    const fieldToRemove = this._selectedField();
    this.props.removeField(fieldToRemove);
    this._unselectField();
  };

  _saveField = () => {
    if (!this._hasSelectedField()) {
      return;
    }

    const field = this._selectedField();
    const newValue = this.refs.editor.value();

    this.props.saveField(field, newValue);
  };

  _onFieldSelected = (item, fieldIndex) => {
    this.setState({ selectedFieldIndex: fieldIndex });
  };

  _unselectField = () => {
    this.setState({ selectedFieldIndex: null });
  };

  _hasSelectedField() {
    return this.state.selectedFieldIndex != null;
  }

  _selectedField() {
    const fields = Object.keys(this.props.hash);
    return fields[this.state.selectedFieldIndex];
  }

  _selectedFieldValue() {
    if (this._hasSelectedField()) {
      const selectedField = this._selectedField();
      return this.props.hash[selectedField];
    } else {
      return '';
    }
  }

  render() {
    const fields = Object.keys(this.props.hash);
    const selectedFieldValue = this._selectedFieldValue();
    const hasSelectedField = this._hasSelectedField();
    const fieldsList = (
      <List
        items={fields}
        onSelect={this._onFieldSelected}
      />
    );

    return (
      <form style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={this.props.keyName}
          position={{ height: 1 }}
          bold
        />
        <ThemedButton
          position={{ height: 1, width: 8, right: 26 }}
          tags
          onClick={this._openAddHashFieldDialog}
          content='{center}Add{/center}' />
        <ThemedButton
          disabled={!hasSelectedField}
          position={{ height: 1, width: 11, right: 14 }}
          tags
          onClick={this._openConfirmationDialog}
          content='{center}Remove{/center}' />
        <ThemedButton
          position={{ height: 1, width: 8, right: 5 }}
          tags
          onClick={this.props.reload}
          content='{center}Reload{/center}' />
        <FilterableList
          List={fieldsList}
          filterList={this.props.filterFields}
          position={{ width: '50%', top: 1 }}
          defaultPattern={this.props.lastPattern}
        />
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref='editor'
            position={{ height: 25, width: '95%' }}
            defaultValue={selectedFieldValue}
            disabled={!hasSelectedField}
          />
          <ThemedButton
            disabled={!hasSelectedField}
            position={{ top: 25, left: 1, height: 1, width: 8 }}
            tags
            onClick={this._saveField}
            content='{center}Save{/center}' />
        </ScrollableBox>
        <AddHashFieldDialog
          position={{ height: 20 }}
          ref='addHashFieldDialog'
          onOk={this._addField}
        />
        <CofnfirmationDialog
          text='Are you sure you want to delete this field'
          onOk={this._removeSelectedFieldIfExists}
          ref='confirmationDialog' 
        />
      </form>
    );
  }
}

export default withTheme(HashContent);
