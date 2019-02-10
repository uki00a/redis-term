import Redis from 'ioredis';

const getHost = () => process.env.REDIS_HOST || 'localhost';
const getDb = () => process.env.REDIS_DB || 15;
const getPort = () => process.env.REDIS_PORT || 6379;

export const connectToRedis = () => {
  const redis = new Redis({
    host: getHost(),
    port: getPort(),
    db: getDb()
  });

  return new Promise((resolve, reject) => {
    const onReady = () => {
      removeListeners();
      resolve(redis);
    };
    const onError = error => {
      removeListeners();
      reject(redis);
    };
    const removeListeners = () => {
      redis.removeAllListeners('ready');
      redis.removeAllListeners('error');
    };
    redis.once('ready', onReady);
    redis.once('error', onError);
  });
};

export const cleanupRedisConnection = async redis => {
  await redis.flushdb();
  await redis.disconnect();
};
