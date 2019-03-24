// @ts-check
// @ts-ignore
import * as path from 'path';
import { makeParentDirectory, writeJSONFile, readJSONFile, fileExists, getPathToConfigDirectory } from '../utils/file';

export async function readSettingsJSON() {
  await ensureSettingsJSON();
  return await readJSONFile(getPathToSettingsJSON());
}

function getPathToSettingsJSON() {
  return path.join(getPathToConfigDirectory(), 'settings.json');
}

async function ensureSettingsJSON() {
  const path = getPathToSettingsJSON();
  if (!(await fileExists(path))) {
    await makeParentDirectory(path);
    await writeJSONFile(path, {});
  }
}