// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import HashContent from '../components/hash-content';
import Loader from '../components/loader';
import { operations } from '../modules/redux/hash';

class HashContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    hash: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    pattern: PropTypes.string.isRequired,
    setHashField: PropTypes.func.isRequired,
    deleteFieldFromHash: PropTypes.func.isRequired,
    filterHashFields: PropTypes.func.isRequired
  };

  _loadHash = () => this.props.filterHashFields(this.props.pattern);

  componentDidMount() {
    this.props.filterHashFields();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    } else {
      return (
        <HashContent
          keyName={this.props.keyName}
          hash={this.props.hash}
          addRow={this.props.setHashField}
          removeRow={this.props.deleteFieldFromHash}
          saveField={this.props.setHashField}
          reload={this._loadHash}
          filterFields={this.props.filterHashFields}
          lastPattern={this.props.pattern}
        />
      );
    }
  }
}

const mapStateToProps = ({ hash }) => ({
  hash: hash.value,
  isLoading: hash.isLoading,
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
)(HashContentContainer);
