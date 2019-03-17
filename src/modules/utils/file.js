// @ts-check
import mkdirp from 'mkdirp';
// @ts-ignore
import * as fs from 'fs'; 
// @ts-ignore
import * as path from 'path';

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