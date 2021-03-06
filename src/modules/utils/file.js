// @ts-check
import mkdirp from 'mkdirp';
// @ts-ignore
import * as fs from 'fs'; 
// @ts-ignore
import * as path from 'path';
// @ts-ignore
import * as os from 'os';
import xdgBaseDir from 'xdg-basedir';
import osenv from 'osenv';

export function getPathToCacheDirectory() {
  if (xdgBaseDir.cache) {
    return path.join(xdgBaseDir.cache, 'redis-term');
  } else {
    const tempdir = os.tmpdir || os.tmpDir
    const user = osenv.user();
    return path.join(tempdir(), user, '.cache/redis-term');
  }
}

export function getPathToConfigDirectory() {
  if (xdgBaseDir.config) {
    return path.join(xdgBaseDir.config, 'redis-term');
  } else {
    const tempdir = os.tmpdir || os.tmpDir
    const user = osenv.user();
    return path.join(tempdir(), user, '.config/redis-term');
  }
}

export function makeParentDirectory(filename) {
  return new Promise((resolve, reject) => {
    mkdirp(path.dirname(filename), error => {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
}

export async function readJSONFile(path) {
  const data = await readFile(path);
  return JSON.parse(data);
}

export function writeJSONFile(path, data) {
  return writeFile(path, JSON.stringify(data, null, 2));
}

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (error, data) => {
      if (error) {
        return reject(error);
      } else {
        return resolve(data);
      }
    });
  });
}

function writeFile(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, error => {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    });
  });
}

export function fileExists(path) {
  return new Promise(resolve => {
    fs.stat(path, (error, stat) => {
      if (error) {
        return resolve(false);
      } else {
        return resolve(stat.isFile());
      }
    });
  });
}