import connect from '../../src/modules/redis/connect-to-redis'

const getHost = () => process.env.REDIS_HOST || 'localhost';
const getDb = () => process.env.REDIS_DB || 15;
const getPort = () => process.env.REDIS_PORT || 6379;

let redis;
export const connectToRedis = async () => {
  if (redis) {
    return redis;
  }

  redis = await connect({
    host: getHost(),
    port: getPort(),
    db: getDb()
  });
  return redis;
};

export const cleanupRedisConnection = async redis => {
  await redis.flushdb();
};
