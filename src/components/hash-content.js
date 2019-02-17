import React, { Component } from 'react';
import List from './list';
import Editor from './editor';
import PropTypes from 'prop-types';
import AddHashFieldDialog from './add-hash-field-dialog';
import ScrollableBox from './scrollable-box';
import FilterableList from './filterable-list';

class HashContent extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    hash: PropTypes.object.isRequired,
    addRow: PropTypes.func.isRequired,
    removeRow: PropTypes.func.isRequired,
    saveField: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    filterFields: PropTypes.func.isRequired,
    lastPattern: PropTypes.string
  };

  state = { selectedFieldIndex: null };

  _addRow = (field, value) => this.props.addRow(field, value);

  _openAddHashFieldDialog = () => {
    this.refs.addHashFieldDialog.open();
  };

  _removeRow = () => {
    if (!this._hasSelectedField()) {
      return;
    }
    const fieldToRemove = this._selectedField();
    this.props.removeRow(fieldToRemove);
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
    const fieldsList = (
      <List
        items={fields}
        onSelect={this._onFieldSelected}
      />
    );

    return (
      <form>
        <box
          content={this.props.keyName}
          position={{ width: '100%', height: 1 }}
          bold
        />
        <FilterableList
          List={fieldsList}
          filterList={this.props.filterFields}
          position={{ width: '50%', top: 1 }}
          defaultPattern={this.props.lastPattern}
        />
        <ScrollableBox
          position={{ left: '50%', top: 1, height: '90%' }}>
          <Editor
            ref='editor'
            position={{ height: 25, width: '95%' }}
            defaultValue={selectedFieldValue}
            disabled={!this._hasSelectedField()}
          />
          <button
            clickable
            mouse
            position={{ top: 25, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this._saveField}
            content='{center}Save{/center}' />
          <button
            clickable
            mouse
            position={{ top: 28, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this._openAddHashFieldDialog}
            content='{center}Add Row{/center}' />
          <button
            clickable
            mouse
            position={{ top: 31, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this._removeRow}
            content='{center}Remove Row{/center}' />
          <button
            clickable
            mouse
            position={{ top: 34, height: 3, width: '95%' }}
            tags
            border='line'
            onClick={this.props.reload}
            content='{center}Reload{/center}' />
        </ScrollableBox>
        <AddHashFieldDialog
          ref='addHashFieldDialog'
          onOk={this._addRow}
        />
      </form>
    );
  }
}

export default HashContent;
