import Redis from 'ioredis';
import { Client as SSHClient } from 'ssh2';
import * as net from 'net';
    
/**
 * @param {object} options 
 */
export default function connectToRedis(options) {
  if (options.ssh) {
    return connectToRedisViaSSH(options)
  } else {
    return establishConnectionToRedis(options);
  }
}

async function connectToRedisViaSSH(options) {
  const sshConnection = await establishConnectionToSSH(options)
  const intermediateServer = await createIntermediateServer(intermediateServerSocket => {
    const { host: actualRedisHost, port: actualRedisPort } = options;
    sshConnection.forwardOut(
      intermediateServerSocket.remoteAddress, intermediateServerSocket.remotePort, 
      actualRedisHost, actualRedisPort,
      (error, redisStream) => {
        if (error) {
          intermediateServerSocket.end();
        } else {
          intermediateServerSocket.pipe(redisStream).pipe(intermediateServerSocket);
        }
      }
    );
  });
  const redis = await establishConnectionToRedis({
    ...options,
    host: '127.0.0.1',
    port: intermediateServer.address().port
  });
  return redis;
}

function establishConnectionToSSH(options) {
  const connection = new SSHClient();
  return new Promise((resolve, reject) => {
    connection.once('ready', () => resolve(connection));
    connection.once('error', reject);
    connection.connect(makeSSHOptions(options));
  });
}

function createIntermediateServer(connectionListener) {
  const server = net.createServer(connectionListener);
  // TODO error handling
  return new Promise((resolve, reject) => {
    return server.listen(0, () => resolve(server));
  });
}

function makeSSHOptions(options) {
  const sshOptions = {
    host: options.ssh.host,
    port: options.ssh.port || 22,
    username: options.ssh.username,
  };
  if (options.ssh.privateKey) {
    sshOptions.privateKey = options.ssh.privateKey;
    sshOptions.passphrase = options.ssh.passphrase;
  } else {
    sshOptions.password = options.ssh.password;
  }
  return sshOptions;
}

function establishConnectionToRedis(options) {
  const redis = new Redis(options);

  return new Promise((resolve, reject) => {
    const onError = error => {
      cleanupListeners();
      redis.disconnect();
      reject(error);
    };
    const onReady = () => {
      cleanupListeners();
      resolve(redis);
    };
    const cleanupListeners = () => {
      redis.removeListener('error', onError);
      redis.removeListener('ready', onReady);
    };
  
    redis.once('error', onError); 
    redis.once('ready', onReady);
  });
}