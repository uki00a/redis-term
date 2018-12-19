import Redis from 'ioredis';

class RedisClient {
  constructor() {
    this._redis = null;
  }

  connect(config = {
    host: 'localhost', 
    port: 6379,
    db: 0
  }) {
    this._redis = new Redis(config);

    return new Promise((resolve, reject) => {
      this._redis.once('connect', resolve);
      this._redis.once('error', reject);
    });
  }

  /**
   * @returns {Promise<[number, string[]]>}
   */
  async scanKeys({
    cursor = 0, 
    pattern = '*',
    count = 100
  } = {}) {
    return await this._redis.scan(cursor, 'MATCH', pattern, 'COUNT', count);   
  }

  /**
   * @returns {Promise<{ type: string, value: any }>}
   */
  async getKeyContent(key) {
    const type = await this._redis.type(key);
    const value = await this._getValueByKeyAndType(key, type);

    return { type, value };
  }

  async _getValueByKeyAndType(key, type) {
    switch (type) {
    case 'hash':
      return await this._redis.hgetall(key);
    case 'string':
      return await this._redis.get(key);
    case 'list':
      return await this._redis.lrange(key, 0, -1); 
    case 'set': 
      return await this._redis.smembers(key);
    case 'zset':
      return await this._redis.zrange(key, 0, -1);
    default:
      throw new Error('not implemented');
    }
  }
}

export const createRedisClient = () => {
  return new RedisClient();
};
