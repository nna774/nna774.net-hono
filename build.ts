import { toSSG } from 'hono/ssg';
import fs from 'fs/promises';
import { glob } from 'glob';
import app from './src/index';

const outDir = './dist';

 // 明らかにヤバい。けど実際ここに来るパスだけを考えると辻褄が合う。app.get('/パス/') ができるようになった暁には、pathでencodeURIするのをやめて、ここはそのままfsを使うようにする。
const myfs = {
  mkdir: (path: string, options: { recursive: boolean}): Promise<void|string> => {
    return fs.mkdir(decodeURI(path), options);
  },
  writeFile: (path: string, data: string | Uint8Array): Promise<void> => {
    return fs.writeFile(decodeURI(path), data);
  },
};

console.log(await toSSG(app, myfs, {dir: outDir}));

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

// feed.xmlが何故か拡張子がついてしまう。
await fs.rename(outDir + '/blog/feed.xml.html', outDir + '/blog/feed.xml');

// lifepng.js
await fs.cp('./src/pages/lifepng/lifepng.js', outDir + '/lifepng/lifepng.js');
