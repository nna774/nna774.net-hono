import { Hono } from 'hono';
import { raw } from 'hono/html';
import { serveStatic } from '@hono/node-server/serve-static';
import { marked } from 'marked';
import parseMD from 'parse-md';
import { promises as fs } from 'node:fs';

import { renderer, blogRenderer } from './renderer';

type Page = {
  title: string;
  content: string;
};

type Metadata = {
  title: string;
};

const page = async (path: string): Promise<Page> => {
  const file = await fs.readFile('./src/pages/' + path, 'utf-8');
  const res = parseMD(file);
  const metadata: Metadata = res.metadata as Metadata;
  const content: string = res.content;
  return { title: metadata.title, content };
};

const app = new Hono();

/// define middleware
app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/blog/')) {
    return blogRenderer(c, next);
  }
  return renderer(c, next);
});
app.get('/css/*', serveStatic({ root: './public' }))

// define html pages routes
const pages = ['index.html'];
pages.map((path) => {
  app.get('/', async (c) => {
    const p = await page(path);
    return c.render(raw(p.content), { title: p.title, path: c.req.path });
  });
});

// define blog routes
app.get('/blog/*', async (c) => {
  const md = await fs.readFile('./md/test.md', 'utf-8');
  const res = parseMD(md);
  const metadata: Metadata = res.metadata as Metadata;
  const content: string = res.content;
  const h = await marked(content);
  return c.render(raw(h), { title: metadata.title });
});

export default app;
