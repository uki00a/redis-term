// @ts-check
import { plistToHash, partitionByParity } from '../utils';
import connectToRedis from './connect-to-redis';

/**
 * @typedef {'string'|'list'|'hash'|'set'|'zset'} RedisType
 */

const DEFAULT_SCORE = 0;

/**
 * @typedef {RedisFacade} Facade
 */

class RedisFacade {
  constructor() {
    this._redis = null;
  }

  connect(options) {
    return connectToRedis(options).then(redis => {
      this._redis = redis;
    });
  }

  disconnect() {
    this._redis.disconnect();
    this._redis = null;
  }

  /**
   * @param {string} keyName 
   * @param {RedisType} type 
   */
  async addNewKeyIfNotExists(keyName, type) {
    const redis = this._getRedis();
    const keyExists = await redis.exists(keyName);
    if (!keyExists) {
      await this.addNewKey(keyName, type);
    } else {
      // TODO handle error
    }
  }

  /**
   * @param {string} keyName 
   * @param {RedisType} type 
   */
  addNewKey(keyName, type) {
    const redis = this._getRedis();
    switch (type) {
    case 'string':
      return redis.set(keyName, 'New String');
    case 'list':
      return redis.lpush(keyName, 'New Element');
    case 'hash':
      return redis.hset(keyName, 'New Key', 'New Value');
    case 'set':
      return redis.sadd(keyName, 'New Member');
    case 'zset':
      return redis.zadd(keyName, DEFAULT_SCORE, 'New Member');
    }
  }

  /**
   * @param {string} keyName 
   */
  async deleteKey(keyName) {
    const redis = this._getRedis();
    await redis.del(keyName);
  }

  /**
   * @param {string} keyName 
   */
  async typeOf(keyName) {
    const redis = this._getRedis();
    return await redis.type(keyName);
  }

  async filterKeysStartWith(pattern = '*') {
    return await this.filterKeys(pattern.endsWith('*') ? pattern : `${pattern}*`);
  }

  async filterKeys(pattern = '*') {
    const redis = this._getRedis();
    const cursor = 0;
    const count = 1000;
    const [_, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', count); // eslint-disable-line no-unused-vars
    return keys;
  }

  /**
   * @param {string} keyName 
   * @param {string} fieldName 
   * @param {string} newValue 
   */
  async updateHashField(keyName, fieldName, newValue) {
    const redis = this._getRedis();
    await redis.hset(keyName, fieldName, newValue);
  }

  /**
   * @param {string} keyName 
   * @param {string} fieldName 
   */
  async deleteFieldFromHash(keyName, fieldName) {
    const redis = this._getRedis();
    await redis.hdel(keyName, fieldName);
  }

  /**
   * @param {string} keyName 
   * @param {string} pattern 
   */
  async filterHashFieldsStartWithPattern(keyName, pattern = '*') {
    return this.filterHashFields(
      keyName,
      pattern.endsWith('*') ? pattern : `${pattern}*`
    );
  }

  async filterHashFields(keyName, pattern = '*') {
    const redis = this._getRedis();
    const cursor = 0;
    const count = 1000;
    const [_, result] = await redis.hscan( // eslint-disable-line no-unused-vars
      keyName, 
      cursor,
      'MATCH',
      pattern.endsWith('*') ? pattern : `${pattern}*`,
      'COUNT',
      count
    );
    return plistToHash(result);
  }

  /**
   * @param {string} keyName 
   * @param {string} newElement 
   */
  async addElementToList(keyName, newElement) {
    const redis = this._getRedis();
    await redis.lpush(keyName, newElement);
  }

  /**
   * @param {string} keyName 
   * @param {number} index 
   * @param {string} newValue 
   */
  async updateListElement(keyName, index, newValue) {
    const redis = this._getRedis();
    await redis.lset(keyName, index, newValue);
  }

  /**
   * @param {string} keyName 
   * @returns {Promise<string[]>}
   */
  async loadListElements(keyName) {
    const redis = this._getRedis();
    const elements = await redis.lrange(keyName, 0, -1);
    return elements;
  }

  /**
   * @param {string} keyName 
   * @param {string} newMember 
   */
  async addMemberToSet(keyName, newMember) {
    const redis = this._getRedis();
    await redis.sadd(keyName, newMember);
  }

  /**
   * @param {string} keyName 
   * @param {string} oldMember 
   * @param {string} newMember 
   */
  async updateSetMemberIfNotExists(keyName, oldMember, newMember) {
    if (!(await this.isMemberOfSet(keyName, newMember))) {
      await this.updateSetMember(keyName, oldMember, newMember);
    }
  }

  /**
   * @param {string} keyName 
   * @param {string} member 
   * @returns {Promise<boolean>}
   */
  async isMemberOfSet(keyName, member) {
    const redis = this._getRedis();
    return await redis.sismember(keyName, member);
  }

  /**
   * @param {string} keyName 
   * @param {string} oldMember 
   * @param {string} newMember 
   */
  async updateSetMember(keyName, oldMember, newMember) {
    const redis = this._getRedis();
    await redis
      .multi()
      .srem(keyName, oldMember)
      .sadd(keyName, newMember)
      .exec();
  }

  /**
   * @param {string} keyName 
   * @param {string} member 
   */
  async deleteMemberFromSet(keyName, member) {
    const redis = this._getRedis();
    await redis.srem(keyName, member);
  }

  /**
   * @param {string} keyName 
   * @param {string} pattern 
   */
  async filterSetMembersStartWithPattern(keyName, pattern = '') {
    return this.filterSetMembers(
      keyName,
      pattern.endsWith('*') ? pattern : `${pattern}*`
    );
  }

  /**
   * @param {string} keyName 
   * @param {string} pattern 
   */
  async filterSetMembers(keyName, pattern = '*') {
    const redis = this._getRedis();
    const cursor = 0;
    const count = 1000;
    const [_, members] = await redis.sscan( // eslint-disable-line no-unused-vars
      keyName,
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      count
    );
    return members;
  }

  /**
   * @param {string} keyName 
   * @param {string} newValue 
   */
  async saveString(keyName, newValue) {
    const redis = this._getRedis();
    await redis.set(keyName, newValue);
  }

  async loadString(keyName) {
    const redis = this._getRedis();
    return await redis.get(keyName);
  }

  /**
   * @param {string} keyName 
   * @param {string} newMember 
   * @param {number} score 
   */
  async addMemberToZset(keyName, newMember, score = DEFAULT_SCORE) {
    const redis = this._getRedis();
    await redis.zadd(keyName, score, newMember);
  }

  /**
   * @param {string} keyName 
   * @param {string} oldMember 
   * @param {string} newMember 
   * @param {number} newScore 
   */
  async updateZsetMember(keyName, oldMember, newMember, newScore = DEFAULT_SCORE) {
    const redis = this._getRedis();
    await redis.multi()
      .zrem(keyName, oldMember)
      .zadd(keyName, newScore, newMember)
      .exec();
  }

  /**
   * @param {string} keyName 
   * @param {string} member 
   */
  async deleteMemberFromZset(keyName, member) {
    const redis = this._getRedis();
    await redis.zrem(keyName, member);
  }

  /**
   * @param {string} keyName 
   * @param {string} pattern 
   * @returns {Promise<[string[], number[]]>}
   */
  filterZsetMembersStartWithPattern(keyName, pattern = '*') {
    return this.filterZsetMembers(
      keyName,
      pattern.endsWith('*') ? pattern : `${pattern}*`
    );
  }

  /**
   * @param {string} pattern 
   * @returns {Promise<[string[], number[]]>}
   */
  async filterZsetMembers(keyName, pattern = '*') {
    const redis = this._getRedis();
    const cursor = 0;
    const count = 1000;
    const [_, values] = await redis.zscan( // eslint-disable-line no-unused-vars
      keyName,
      cursor,
      'MATCH',
      pattern,
      'COUNT',
      count
    );
    return partitionByParity(values);
  }

  _getRedis() {
    return this._redis;
  }
}

export const createFacade = () => {
  return new RedisFacade();
};