import { Hono } from 'hono';
import { raw } from 'hono/html';
import { serveStatic } from '@hono/node-server/serve-static';
import { marked } from 'marked';
import parseMD from 'parse-md';
import { promises as fs } from 'node:fs';
import { glob } from 'glob';

import { renderer, blogRenderer } from './renderer';

type Page = {
  title: string;
  content: string;
};

type Metadata = {
  title: string;
  date?: number;
};

type MetadataString = { [key in keyof Metadata]: string };

const parse = (v: string): { metadata: Metadata, content: string } => {
  const res = parseMD(v);
  const metadata: MetadataString = res.metadata as MetadataString;
  const content: string = res.content;
  return {
    metadata: {
      title: metadata.title,
      date: metadata.date ? Date.parse(metadata.date) : undefined
    },
    content
  };
}

const page = async (path: string): Promise<Page> => {
  const file = await fs.readFile('./src/pages/' + path, 'utf-8');
  const { metadata, content } = parse(file);
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
const pages = ['index.html']; // TODO: grobにする。
pages.map((path) => {
  app.get('/', async (c) => {
    const p = await page(path);
    return c.render(raw(p.content), { title: p.title, path: c.req.path });
  });
});

// define blog article routes
const blogPaths = await glob('./src/blog/**/*.md');
const blog = await Promise.all(blogPaths.map(async (path) => {
  const md = await fs.readFile(path, 'utf-8');
  const { metadata, content } = parse(md);
  const h = await marked(content);
  const d = path.substring(0, 10); // 2024/01/01 like
  console.log(d);
  console.log(metadata.date);
  return {
    path: path.substring(4, path.length - 3), // remove prefix src and suffix .md
    title: metadata.title,
    content: h,
    date: new Date(metadata.date || Date.parse(d))
  }
}));
console.log(blog);
blog.map((article) => {
  app.get(article.path, (c) => {
    return c.render(raw(article.content), { title: article.title });
  });
});

// define blog system routes
// TODO:

export default app;
