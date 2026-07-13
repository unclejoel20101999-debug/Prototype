import fg from 'fast-glob';
import path from 'path';
import fs from 'fs-extra';

/**
 * Adds a dot to extensions if there isn't one.
 * @param {string[]} exts
 * @returns {string[]}
 */
function normalizeExtensions(exts) {
  return exts.map(ext => ext.startsWith('.') ? ext : `.${ext}`);
}

/**
 * Gets a list of files in the directory by the specified extensions.
 * @param {string} dir
 * @param {string[]} extensions
 * @returns {Promise<string[]>}
 */
async function getFilesByExt(dir, extensions) {
  const patterns = extensions.map(ext => `**/*${ext}`);
  return await fg(patterns, {
    cwd: dir,
    onlyFiles: true,
    dot: true,
  });
}

/**
 * Deletes empty directories recursively.
 * @param {string} dir
 */
async function removeEmptyDirs(dir) {
  if (!await fs.pathExists(dir)) return;

  const entries = await fs.readdir(dir);
  if (entries.length === 0) {
    await fs.remove(dir);
    return;
  }

  await Promise.all(entries.map(async entry => {
    const fullPath = path.join(dir, entry);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await removeEmptyDirs(fullPath);
    }
  }));

  const after = await fs.readdir(dir);
  if (after.length === 0) {
    await fs.remove(dir);
  }
}

/**
 * Clears distDir of files missing from appDir.
 * @param {Object} options
 * @param {string[]} options.ext - original file extensions (without a dot)
 * @param {string} options.appDir - source folder
 * @param {string} options.distDir - target folder
 * @param {string[]} [options.includeDerivedExt] - additional extensions that also need to be uninstalled
 * @param {string[]} [options.exclude] - list of relative paths that cannot be deleted
 */
export async function cleanOrphans({
  ext = [],
  appDir,
  distDir,
  includeDerivedExt = [],
  exclude = [],
} = {}) {
  // If distDir does not exist - do nothing
  if (!await fs.pathExists(distDir)) return;

  const normalizedExt = normalizeExtensions(ext);
  const normalizedDerivedExt = normalizeExtensions(includeDerivedExt);

  const appFiles = await getFilesByExt(appDir, normalizedExt);
  const distFiles = await getFilesByExt(distDir, [...normalizedExt, ...normalizedDerivedExt]);

  const appFileBases = new Set(appFiles.map(f => f.replace(/\.[^.]+$/, '')));

  const orphanFiles = distFiles.filter(file => {
    const base = file.replace(/\.[^.]+$/, '');
    return !appFileBases.has(base) && !exclude.includes(file);
  });

  if (orphanFiles.length !== 0) {
    for (const file of orphanFiles) {
      const fullPath = path.join(distDir, file);
      await fs.remove(fullPath);
    }
  }

  // Delete empty folders
  await removeEmptyDirs(distDir);
}