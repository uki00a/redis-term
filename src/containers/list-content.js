import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ListContent from '../components/list-content';
import { withRedis } from '../contexts/redis-context';
import theme from '../theme';

class ListContentContainer extends Component {
  static propTypes = {
    keyName: PropTypes.string.isRequired,
    redis: PropTypes.object.isRequired
  };

  state = { value: [] };

  _addRow = async value => {
    if (!value) {
      return;
    }

    const { keyName, redis } = this.props;

    await redis.lpush(keyName, value);
    this.setState({
      value: [value].concat(this.state.value)
    });
  };

  _save = async (value, index) => {
    const { keyName, redis } = this.props;

    await redis.lset(keyName, index, value);
    this.setState({
      value: this.state.value.map((x, i) => i === index ? value : x)
    });
  };

  _loadList = async () => {
    // TODO show loader
    const { keyName, redis } = this.props;
    const value = await redis.lrange(keyName, 0, -1); 

    this.setState({ value });
  };

  async componentDidMount() {
    this._loadList();
  }

  render() {
    return (
      <ListContent
        keyName={this.props.keyName}
        value={this.state.value}
        theme={theme}
        addRow={this._addRow}
        save={this._save}
        reload={this._loadList}
      />
    );
  }
}

export default withRedis(ListContentContainer);
