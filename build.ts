import { toSSG } from 'hono/ssg';
import fs from 'fs/promises';
import { glob } from 'glob';
import app from './src/index';

const outDir = './dist';

toSSG(app, fs, {dir: outDir});

// blogの付属品をコピーする。
const files = await glob('./src/blog/**/*');
files.map(async (file) => {
  if (!file.endsWith('.md') && (await fs.stat(file)).isFile()) {
    fs.cp(file, file.replace('src/blog/', outDir + '/blog/'));
  }
});
