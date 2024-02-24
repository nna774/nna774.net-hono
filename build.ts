import { toSSG } from 'hono/ssg';
import fs from 'fs/promises';
import { glob } from 'glob';
import app from './src/index';

const outDir = './dist';

await toSSG(app, fs, {dir: outDir});

// blogの付属品をコピーする。
const files = await glob('./src/blog/**/*');
await Promise.all(files.map(async (file) => {
  if (!file.endsWith('.md') && (await fs.stat(file)).isFile()) {
    await fs.cp(file, file.replace('src/blog/', outDir + '/blog/'));
  }
}));
