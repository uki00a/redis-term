import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import KeyContent from './key-content';
import KeyboardBindings from './keyboard-bindings';
import KeyList from '../components/key-list';
import FilterableList from '../components/filterable-list';
import AddNewKeyDialog from '../components/add-new-key-dialog';
import ConfirmationDialog from '../components/confirmation-dialog';
import { operations, actions } from '../modules/redux/keys';

class Database extends Component {
  static propTypes = {
    keys: PropTypes.array.isRequired,    
    isLoading: PropTypes.bool,
    selectedKey: PropTypes.string,
    selectedKeyType: PropTypes.string,
    selectKey: PropTypes.func.isRequired,
    unselectKey: PropTypes.func.isRequired,
    addKey: PropTypes.func.isRequired,
    deleteKey: PropTypes.func.isRequired,
    filterKeys: PropTypes.func.isRequired
  };

  _handleKeySelect = (item, keyIndex) => {
    const key = this.props.keys[keyIndex];
    this.props.selectKey(key);
  };

  _addNewKeyIfNotExists = (keyName, type) => {
    this.props.addKey(keyName, type).then(() => {
      this._focusToKeyList();
    });
  };

  _deleteHoveredKey = async () => {
    const hoveredKeyIndex = this.refs.keyList.selected();
    const hoveredKey = this.props.keys[hoveredKeyIndex];
    if (hoveredKey) {
      this.props.deleteKey(hoveredKey).then(() => {
        this._unselectKey();
      });
    }
  };

  _unselectKey() {
    this.props.unselectKey();
  }

  _loadKeys = () => {
    this.props.filterKeys('*');
  };

  _filterKeys = pattern => {
    this.props.filterKeys(pattern).then(() => this._focusToKeyList());
  };

  _renderKeyList() {
    const keyboardBindings = [
      { key: 'f5', handler: this._loadKeys, description: 'Reload Keys' },
      { key: 'C-r', handler: this._loadKeys, description: 'Reload Keys' },
      { key: 'a', handler: this._openAddNewKeyDialog, description: 'Add New Key' },
      { key: 'd', handler: this._openConfirmationDialog, description: 'Delete Selected Key' }
    ];

    return (
      <KeyboardBindings bindings={keyboardBindings}>
        <KeyList
          label='keys'
          ref='keyList'
          keys={this.props.keys}
          onSelect={this._handleKeySelect} />
      </KeyboardBindings>
    );
  }
  
  _openAddNewKeyDialog = () => this.refs.addNewKeyDialog.open();
  _openConfirmationDialog = () => {
    this.refs.confirmationDialog.open();
  };

  _focusToKeyList = () => {
    this.refs.keyList.focus();
  };

  async componentDidMount() {
    this._focusToKeyList();
    this._unselectKey();
    this._loadKeys();
  }

  render() {
    const keyList = this._renderKeyList();
    return (
      <box position={{ top: 1, left: 1, bottom: 2, right: 3 }}>
        <FilterableList 
          position={{left: 0, top: 0, bottom: 0, width: 30}}
          List={keyList}
          filterList={this._filterKeys}
          { ...this.props }
        />
        <box position={{ left: 30, top: 0, right: 0 }}>
          <KeyContent
            keyName={this.props.selectedKey}
            type={this.props.selectedKeyType}>
          </KeyContent>
        </box>
        <AddNewKeyDialog
          ref='addNewKeyDialog'
          onOk={this._addNewKeyIfNotExists} 
          onCancel={this._focusToKeyList}
        />
        <ConfirmationDialog
          text='Are you sure you want to delete this key?'
          onOk={this._deleteHoveredKey}
          onCancel={this._focusToKeyList}
          ref='confirmationDialog'
        />
      </box>
    );
  }
}

const mapStateToProps = ({ keys }) => {
  return {
    keys: keys.list,
    isLoading: keys.isLoading,
    selectedKey: keys.selectedKeyName,
    selectedKeyType: keys.selectedKeyType
  };
};

const mapDispatchToProps = {
  filterKeys: operations.filterKeys,
  selectKey: operations.selectKey,
  unselectKey: actions.unselectKey,
  addKey: operations.addNewKeyIfNotExists,
  deleteKey: operations.deleteKey
};

export default connect(
  mapStateToProps,  
  mapDispatchToProps
)(Database);
