import { Hono } from 'hono';
import { raw } from 'hono/html';
import { serveStatic } from '@hono/node-server/serve-static';
import { marked } from 'marked';
import parseMD from 'parse-md';
import { promises as fs } from 'node:fs';
import { glob } from 'glob';

import { renderer, blogRenderer, baseURI } from './renderer';

import { BlogBody, BlogArticle, BlogType, makeInfo } from './partials/blog';

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
      date: metadata.date ? Date.parse(metadata.date.replace('JST', '+09:00')) : undefined, // datry hack
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
// blogの付属品は横に置いてある。いろんな拡張子があってびっくりするけど、以下に足せば返せるようになる。
app.get('/blog/:image{.+\\.(png|jpg|jpeg|JPG|hs|pdf|ogg|)$}', serveStatic({ root: './src' }));

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
  blogPaths.map(async (filePath): Promise<BlogType> => {
    const md = await fs.readFile(filePath, 'utf-8');
    const { metadata, content } = parse(md);
    const h = await marked(content);
    const d = filePath.substring(9, 19); // 2024/01/01 like
    const path = '/' + filePath.substring(4, filePath.length - 3); // remove prefix src and suffix .md
    return {
      path,
      canonical: baseURI + path,
      title: metadata.title,
      content: h,
      date: new Date(metadata.date || Date.parse(d)),
      tags: metadata.tags,
    };
  }))).sort((a, b) => b.date.getTime() - a.date.getTime());


const blogInfo = makeInfo(blog);

const canonical = (c: any) => 'https://nna774.net' + c.req.path;

blog.map((article) => {
  app.get(article.path, (c) => {
    return c.render(
      <BlogBody blogInfo={blogInfo} canonical={canonical(c)}><BlogArticle props={article} individual={true} /></BlogBody>,
      { title: article.title, path: c.req.path });
  });
});

// define blog system routes
app.get('/blog/', (c) => {
  const news = blog.slice(0, 10);
  return c.render(
    <BlogBody blogInfo={blogInfo} canonical={canonical(c)}>
      {news.map((n) => <BlogArticle props={{ individual: false, ...n }} />)}
    </BlogBody>
  , { title: '/dev/nona (いっと☆わーくす！)', path: c.req.path });
});
// TODO: いっぱいある

export default app;
