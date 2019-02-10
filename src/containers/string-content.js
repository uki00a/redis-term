import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StringContent from '../components/string-content';
import Loader from '../components/loader';
import MessageDialog from '../components/message-dialog';
import { withRedis } from '../contexts/redis-context';

class Message extends Component {
  componentDidMount() {
    this.refs.message.error('error occurred!!!');
  }
  render() {
    return <message ref='message' />
  }
}

class StringContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = {
    value: '',
    isLoading: false
  };

  _save = async newValue => {
    this._saveChangeToDb(newValue);
    this.setState({ value: newValue });
    this.refs.messageDialog.open();
  };

  async _saveChangeToDb(newValue) {
    const { keyName, redis } = this.props;
    await redis.set(keyName, newValue);
  }

  _loadString = async () => {
    this._showLoader();
    const { keyName, redis } = this.props;
    const value = await redis.get(keyName);

    this.setState({ value });
    this._hideLoader();
  };

  _showLoader() {
    this.setState({ isLoading: true });
  }

  _hideLoader() {
    this.setState({ isLoading: false });
  }

  componentDidMount() {
    this._loadString();
  }

  render() {
    if (this.state.isLoading) {
      return <Loader />;
    } else {
      return (
        <box>
          <StringContent
            keyName={this.props.keyName}
            value={this.state.value}
            save={this._save}
            reload={this._loadString}
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

export default withRedis(StringContentContainer);
