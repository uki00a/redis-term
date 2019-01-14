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

  async componentDidMount() {
    // TODO show loader
    const { keyName, redis } = this.props;
    const value = await redis.lrange(keyName, 0, -1); 

    this.setState({ value });
  }

  render() {
    return (
      <ListContent
        value={this.state.value}
        theme={theme}
      />
    );
  }
}

export default withRedis(ListContentContainer);
