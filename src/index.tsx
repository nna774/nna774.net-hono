import { Hono } from 'hono';
import { raw } from 'hono/html';
import { marked } from 'marked';
import parseMD from 'parse-md';
import { promises as fs } from 'node:fs';

import { renderer, blogRenderer } from './renderer';

const app = new Hono();

app.use('*', async (c, next) => {
  if (c.req.path.startsWith('/blog/')) {
    return blogRenderer(c, next);
  }
  return renderer(c, next);
});

app.get('/', (c) => {
  return c.render(<h1>hao</h1>, { title: 'Hello, World!', path: c.req.path });
});

app.get('/markdown.html', async (c) => {
  const md = await fs.readFile('./md/test.md', 'utf-8');
  const html = await marked(md);
  return c.render(html);
});

type Metadata = {
  title: string;
};

app.get('/blog/*', async (c) => {
  const md = await fs.readFile('./md/test.md', 'utf-8');
  const res = parseMD(md);
  const metadata: Metadata = res.metadata as Metadata;
  const content: string = res.content;
  const h = await marked(content);
  return c.render(raw(h), { title: metadata.title });
});


export default app;
