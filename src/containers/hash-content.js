// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import KeyboardBindings from './keyboard-bindings';
import List from '../components/list';
import Editor from '../components/editor';
import AddHashFieldDialog from '../components/add-hash-field-dialog';
import ScrollableBox from '../components/scrollable-box';
import FilterableList from '../components/filterable-list';
import ThemedButton from '../components/themed-button';
import CofnfirmationDialog from '../components/confirmation-dialog';
import Loader from '../components/loader';
import { withTheme } from '../contexts/theme-context';
import { operations } from '../modules/redux/hash';

class HashContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    hash: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    isSaving: PropTypes.bool.isRequired,
    pattern: PropTypes.string.isRequired,
    setHashField: PropTypes.func.isRequired,
    deleteFieldFromHash: PropTypes.func.isRequired,
    filterHashFields: PropTypes.func.isRequired
  };

  state = { editingFieldIndex: null };

  _openAddHashFieldDialog = () => {
    this.refs.addHashFieldDialog.open();
  };

  _openConfirmationDialog = () => {
    this.refs.confirmationDialog.open();
  };

  _onFieldSelected = (item, fieldIndex) => {
    this.setState({ editingFieldIndex: fieldIndex });
  };

  _unselectField = () => {
    this.setState({ editingFieldIndex: null });
  };

  _hasEditingField() {
    return this.state.editingFieldIndex != null;
  }

  _editingField() {
    const fields = Object.keys(this.props.hash);
    return fields[this.state.editingFieldIndex];
  }

  _editingFieldValue() {
    if (this._hasEditingField()) {
      const editingField = this._editingField();
      return this.props.hash[editingField];
    } else {
      return '';
    }
  }

  _removeHoveredFieldIfExists = () => {
    const fieldToRemove = this._hoveredField();
    if (fieldToRemove) {
      this._removeField(fieldToRemove);
    }
  };

  _removeField = fieldToRemove => {
    this._unselectField();
    this.props.deleteFieldFromHash(fieldToRemove)
      .then(() => this._focusToFieldList());
  };

  _hoveredField() {
    const fields = Object.keys(this.props.hash);
    const index = this._hoveredFieldIndex();
    return fields[index];
  }

  _hoveredFieldIndex() {
    return this.refs.fieldList.selected();
  }

  _saveEditingField = () => {
    if (!this._hasEditingField()) {
      return;
    }

    const field = this._editingField();
    const newValue = this.refs.editor.value();
    this.props.setHashField(field, newValue)
      .then(() => this._focusToFieldList());
  };

  _addField = (key, value) => {
    this.props.setHashField(key, value).then(() => this._focusToFieldList());
  };

  _loadHash = () => {
    this._unselectField();
    this.props.filterHashFields(this.props.pattern)
      .then(() => this._focusToFieldList());
  };

  _filterHash = pattern => {
    this._unselectField();
    this.props.filterHashFields(pattern)
      .then(() => this._focusToFieldList());
  }

  _focusToFieldList = () => {
    this.refs.fieldList.focus();
  };

  componentDidMount() {
    this.props.filterHashFields();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    }
    
    const fields = Object.keys(this.props.hash);
    const editingFieldValue = this._editingFieldValue();
    const hasEditingField = this._hasEditingField();
    const fieldsList = (
      <KeyboardBindings bindings={[
        { key: 'C-r', handler: this._loadHash, description: 'Reload' },
        { key: 'a', handler: this._openAddHashFieldDialog, description: 'Add Field' },
        { key: 'd', handler: this._openConfirmationDialog, description: 'Delete Field' }
      ]}>
        <List
          ref='fieldList'
          items={fields}
          onSelect={this._onFieldSelected}
        />
      </KeyboardBindings>
    );

    return (
      <form style={this.props.theme.box}>
        <box
          style={this.props.theme.box}
          content={this.props.keyName}
          position={{ height: 1 }}
          bold
        />
        <FilterableList
          List={fieldsList}
          filterList={this._filterHash}
          position={{ width: '50%', top: 1 }}
          defaultPattern={this.props.pattern}
        />
        <ScrollableBox
          style={this.props.theme.box}
          position={{ left: '50%', top: 1, height: '90%' }}>
          <KeyboardBindings bindings={[
            { key: 'C-s', handler: this._saveEditingField, description: 'Save' }
          ]}>
            <Editor
              ref='editor'
              position={{ height: 25, width: '95%' }}
              defaultValue={editingFieldValue}
              disabled={!hasEditingField}
            />
          </KeyboardBindings>
          <Loader
            text='saving...' 
            hidden={!this.props.isSaving}
            top={25}
          />
        </ScrollableBox>
        <AddHashFieldDialog
          position={{ height: 20 }}
          ref='addHashFieldDialog'
          onOk={this._addField}
          onCancel={this._focusToFieldList}
        />
        <CofnfirmationDialog
          text='Are you sure you want to delete this field'
          onOk={this._removeHoveredFieldIfExists}
          onCancel={this._focusToFieldList}
          ref='confirmationDialog' 
        />
      </form>
    );   
  }
}

const mapStateToProps = ({ hash }) => ({
  hash: hash.value,
  isLoading: hash.isLoading,
  isSaving: hash.isSaving,
  pattern: hash.pattern
});

const mapDispatchToProps = {
  deleteFieldFromHash: operations.deleteFieldFromHash,
  filterHashFields: operations.filterHashFields,
  setHashField: operations.setHashField
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(HashContentContainer));
