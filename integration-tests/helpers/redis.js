import RedisFacade from '../../src/modules/redis/facade';

const getHost = () => process.env.REDIS_HOST || 'localhost';
const getDb = () => process.env.REDIS_DB || 15;
const getPort = () => process.env.REDIS_PORT || 6379;

/**
 * @returns {import('../../src/modules/redis/facade').default}
 */
export const connectToRedis = async () => {
  const facade = new RedisFacade();
  await facade.connect({
    host: getHost(),
    port: getPort(),
    db: getDb()
  });
  return facade;
};

/**
 * 
 * @param {import('../../src/modules/redis/facade').default} facade 
 */
export const cleanupRedisConnection = async facade => {
  await facade.flushdb();
  await facade.disconnect();
};
