import { toSSG } from 'hono/ssg';
import fs from 'fs/promises';
import { glob } from 'glob';
import app from './src/index';

const outDir = './dist';

console.log(await toSSG(app, fs, {dir: outDir}));

// blogの付属品をコピーする。
const files = await glob('./src/blog/**/*');
await Promise.all(files.map(async (file) => {
  if (!file.endsWith('.md') && (await fs.stat(file)).isFile()) {
    await fs.cp(file, file.replace('src/blog/', outDir + '/blog/'));
  }
}));

// public以下をコピーする。
const publicFiles = await glob('./public/**/*');
await Promise.all(publicFiles.map(async (file) => {
  if ((await fs.stat(file)).isFile()) {
    await fs.cp(file, file.replace('public/', outDir + '/'));
  }
}));
