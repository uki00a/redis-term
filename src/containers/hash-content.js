import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRedis } from '../contexts/redis-context';
import HashContent from '../components/hash-content';
import Loader from '../components/loader';

class HashContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { hash: {}, isLoading: false, lastPattern: '' };

  _saveField = async (field, newValue) => {
    await this._saveFieldToDb(field, newValue);
    this._saveFieldToState(field, newValue);
  };

  async _saveFieldToDb(field, newValue) {
    const { redis, keyName } = this.props;
    await redis.hset(keyName, field, newValue);
  }

  _saveFieldToState(field, value) {
    const newHash = {
      ...this.state.hash,
      [field]: value
    };

    this.setState({ hash: newHash });
  }

  _removeField = async fieldToRemove => {
    await this._deleteFieldFromDb(fieldToRemove);
    this._removeFieldFromState(fieldToRemove);
  };

  async _deleteFieldFromDb(fieldToDelete) {
    const { redis, keyName } = this.props;
    await redis.hdel(keyName, fieldToDelete);
  }

  _removeFieldFromState(fieldToRemove) {
    const newHash = { ...this.state.hash };
    delete newHash[fieldToRemove];
    this.setState({ hash: newHash });
  }

  _loadHash = () => this._filterFields();

  _filterFields = async (pattern = '') => {
    this._showLoader();
    const hash = await this._scanFieldsStartWith(pattern);
    this.setState({ hash, lastPattern: pattern });
    this._hideLoader();
  };

  async _scanFieldsStartWith(pattern) {
    const { redis, keyName } = this.props;
    const cursor = 0;
    const count = 1000;
    const [newCursor, result] = await redis.hscan(
      keyName, 
      cursor,
      'MATCH',
      pattern.endsWith('*') ? pattern : `${pattern}*`,
      'COUNT',
      count
    );
    return this._makeHashFromScannedResult(result);
  }

  _makeHashFromScannedResult(scannedResult) {
    const hash = {};
    for (let i = 0; i < scannedResult.length; i += 2) {
      const field = scannedResult[i];
      const value = scannedResult[i+1];
      hash[field] = value;
    }
    return hash;
  }

  _showLoader() {
    this.setState({ isLoading: true });
  }

  _hideLoader() {
    this.setState({ isLoading: false });
  }

  componentDidMount() {
    this._loadHash();
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <HashContent
          keyName={this.props.keyName}
          hash={this.state.hash}
          addRow={this._saveField}
          removeRow={this._removeField}
          saveField={this._saveField}
          reload={this._loadHash}
          filterFields={this._filterFields}
          lastPattern={this.state.lastPattern}
        />
      );
    }
  }
}

export default withRedis(HashContentContainer);
