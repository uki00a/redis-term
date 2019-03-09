// @ts-check
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import StringContent from '../components/string-content';
import Loader from '../components/loader';
import MessageDialog from '../components/message-dialog';
import { operations } from '../modules/redux/string';

class StringContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    value: PropTypes.string,
    isLoading: PropTypes.bool.isRequired,
    saveString: PropTypes.func.isRequired,
    loadString: PropTypes.func.isRequired
  };

  _save = newValue => {
    this.props.saveString(newValue);
    // TODO fix display timing
    this.refs.messageDialog.open();
  };

  componentDidMount() {
    this.props.loadString();
  }

  render() {
    if (this.props.isLoading) {
      return <Loader />;
    } else {
      return (
        <box>
          <StringContent
            keyName={this.props.keyName}
            value={this.props.value}
            save={this._save}
            reload={this.props.loadString}
          />
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
)(StringContentContainer);
