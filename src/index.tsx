import { Hono } from 'hono';
import { raw } from 'hono/html';
import { serveStatic } from '@hono/node-server/serve-static';
import { marked } from 'marked';
import parseMD from 'parse-md';
import { promises as fs } from 'node:fs';
import { glob } from 'glob';

import { renderer, blogRenderer } from './renderer';

import { BlogArticle, BlogType, BlogInfoType } from './partials/blog';

type Page = {
  title: string;
  content: string;
};

type Metadata = {
  title: string;
  date?: number;
  tags?: string[];
};

type MetadataString = { [key in keyof Metadata]: string };

const parse = (v: string): { metadata: Metadata, content: string } => {
  const res = parseMD(v);
  const metadata: MetadataString = res.metadata as MetadataString;
  const content: string = res.content;
  const tags = metadata.tags ? metadata.tags.toString().split(',').map((t) => t.trim()) : []; // 2048 みたいなタグがtoStringしないと爆発していた。
  return {
    metadata: {
      title: metadata.title,
      date: metadata.date ? Date.parse(metadata.date) : undefined,
      tags,
    },
    content
  };
};

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
app.get('/css/*', serveStatic({ root: './public' }));
app.get('/img/*', serveStatic({ root: './public' }));

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
const blog = (await Promise.all(
  blogPaths.map(async (path): Promise<BlogType> => {
    const md = await fs.readFile(path, 'utf-8');
    const { metadata, content } = parse(md);
    const h = await marked(content);
    const d = path.substring(9, 19); // 2024/01/01 like
    return {
      path: '/' + path.substring(4, path.length - 3), // remove prefix src and suffix .md
      title: metadata.title,
      content: h,
      date: new Date(metadata.date || Date.parse(d)),
      tags: metadata.tags,
    };
  }))).sort((a, b) => b.date.getTime() - a.date.getTime());
blog.map((article) => {
  app.get(article.path, (c) => {
    return c.render(<BlogArticle props={article} />, { title: article.title, path: c.req.path });
  });
});

const info = (blog: BlogType[]): BlogInfoType => {
  return {
    blog: blog,
    tags: blog.map((b) => b.tags || []).flat().reduce((acc, tag) => {
      const v = acc.get(tag);
      if (!v) {
        acc.set(tag, 1);
      } else {
        acc.set(tag, v + 1);
      }
      return acc;
    }, new Map<string, number>()),
  };
};

const blogInfo = info(blog);

// define blog system routes
app.get('/blog/', (c) => {
  const news = blog.slice(0, 10);
  return c.render(
    <>
      {news.map((n) => <BlogArticle props={{ individual: false, ...n }} />)}
    </>
  , { title: 'Blog', blogInfo });
});
// TODO: いっぱいある

export default app;
