import { Hono } from 'hono';
import { raw } from 'hono/html';
import { serveStatic } from '@hono/node-server/serve-static';
import { marked } from 'marked';
import parseMD from 'parse-md';
import { promises as fs } from 'node:fs';
import { glob } from 'glob';
import RSS from 'rss';

import { renderer, blogRenderer, baseURI } from './renderer';

import { BlogBody, BlogArticle, BlogType, makeInfo, BlogLinks, tag_path } from './partials/blog';

type Page = {
  metadata: Metadata;
  content: string;
};

type Metadata = {
  title: string;
  date?: number;
  tags?: string[];
  customJS?: string;
};

type MetadataString = { [key in keyof Metadata]: string };

const parse = (v: string): { metadata: Metadata, content: string } => {
  const res = parseMD(v);
  const metadata: MetadataString = res.metadata as MetadataString;
  const content: string = res.content;
  const tags = metadata?.tags ? metadata.tags.toString().split(',').map((t) => t.trim()) : []; // 2048 みたいなタグがtoStringしないと爆発していた。
  return {
    metadata: {
      title: metadata.title,
      date: metadata.date ? Date.parse(metadata.date.replace('JST', '+09:00')) : undefined, // datry hack
      tags,
      customJS: metadata.customJS,
    },
    content
  };
};

const page = async (path: string): Promise<Page> => {
  if (path.endsWith('/')) {
    path += 'index.html';
  }
  const file = await fs.readFile('./src/pages' + path, 'utf-8');
  return parse(file);
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
app.get('/piet/c88paper.pdf', serveStatic({ root: './public' }));
// blogの付属品は横に置いてある。いろんな拡張子があってびっくりするけど、以下に足せば返せるようになる。
// どうせdevの時だけしかここは使われない(build.tsの中でSSG向けではコピーしている)。
app.get('/blog/:image{.+\\.(png|jpg|jpeg|JPG|hs|pdf|ogg|)$}', serveStatic({ root: './src' }));

// define html pages routes
const pages = [
  '/',
  '/about/',
  '/OpenYo/',
  '/piet/',
  '/projects/',
  '/lifepng/',
  '/PRs/',
  '/3x3x3x3/',
  '/errors/404.html',
]; // TODO: grobにする。
pages.map(async (path) => {
  const p = await page(path);
  app.get(path, (c) => {
    return c.render(raw(p.content), { title: p.metadata.title, path: c.req.path, ephemeral: false, customJS: p.metadata.customJS });
  });
});

// customJS
[
  'lifepng/lifepng.js',
].map((path) => {
  app.get(path, serveStatic({ root: './src/pages' }));
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
  })))
  .filter((b) => !b.tags?.includes('published_false')) // published_falseタグのついてる記事は公開しない。
  .sort((a, b) => b.date.getTime() - a.date.getTime());
const blogInfo = makeInfo(blog);

const canonical = (c: any) => 'https://nna774.net' + c.req.path;

const ArticleChain = (pastArticle?: BlogType, futureArticle?: BlogType) => (
  <p class='articleChain'>
    { pastArticle ? <a href={pastArticle.path} >&lt;&lt; 過去の記事({pastArticle.title})</a> : '<< 過去の記事' }{ ' ' }
    { futureArticle ? <a href={futureArticle.path} >未来の記事({futureArticle.title}) &gt;&gt;</a> : '未来の記事 >>' }
  </p>
);

blog.map((article, i) => {
  app.get(article.path, (c) => {
    const chain = ArticleChain(i !== blog.length ? blog[i + 1]: undefined, i !== 0 ? blog[i - 1] : undefined);
    return c.render(
      <BlogBody blogInfo={blogInfo} canonical={canonical(c)}>
        {chain}
        <BlogArticle props={article} individual={true} />
        {chain}
      </BlogBody>,
      { title: article.title, path: c.req.path, ephemeral: false });
  });
});

const PageChain = (pageNumber: number, maxPage: number, hasPast: boolean, hasFuture: boolean) => (
  <p class='pageChain'>
    { hasPast ? <a href={`/blog/page/${pageNumber + 1}/`} >過去のページ</a> : '過去のページ' }{ ' ' }
    Page {pageNumber} of {maxPage}{ ' ' }
    { hasFuture ? <a href={`/blog/page/${pageNumber - 1}/`} >未来のページ</a> : '未来のページ' }
  </p>
);

const PER_PAGE = 5;
const maxPage = Math.ceil(blog.length/PER_PAGE);

// define blog system routes
app.get('/blog/', (c) => {
  const articles = blog.slice(0, PER_PAGE);
  const chain = PageChain(1, maxPage, true, false);
  return c.render(
    <BlogBody blogInfo={blogInfo} canonical={canonical(c)}>
      {chain}
      {articles.map((n) => <BlogArticle props={{ individual: false, ...n }} />)}
      {chain}
    </BlogBody>
  , { title: '/dev/nona (いっと☆わーくす！)', path: c.req.path, ephemeral: false });
});

for (let i = 1; i <= maxPage; ++i) {
  app.get(`/blog/page/${i}/`, (c) => {
    const articles = blog.slice((i - 1) * PER_PAGE, i * PER_PAGE);
    const chain = PageChain(i, maxPage, i !== maxPage, i !== 1);
    return c.render(
      <BlogBody blogInfo={blogInfo} canonical={canonical(c)}>
        {chain}
        {articles.map((n) => <BlogArticle props={{ individual: false, ...n }} />)}
        {chain}
      </BlogBody>
    , { title: '/dev/nona (いっと☆わーくす！)', path: c.req.path, ephemeral: true });
  });
}

// ssgのためには、存在するのを教えてあげないといけないので /blog/tags/:name/ のように書けない。
blogInfo.tags.forEach((_, tag) => {
  app.get(tag_path(tag), (c) => {
    const articles = blog.filter((a) => a.tags?.map((t) => t.toLowerCase()).includes(tag.toLowerCase()));
    return c.render(
      <BlogLinks blogInfo={blogInfo} canonical={canonical(c)} articles={articles} title={`Articles tagged ${tag}(${articles.length})`} />
    , { title: `Articles tagged ${tag}`, path: c.req.path, ephemeral: true });
  });
});
blogInfo.monthly.forEach((v, year) => {
  app.get(`/blog/${year}/`, (c) => {
    const articles = blog.filter((a) => a.date.getFullYear() === year);
    return c.render(
      <BlogLinks blogInfo={blogInfo} canonical={canonical(c)} articles={articles} title={`Articles in ${year}(${articles.length})`} />
    , { title: `Articles in ${year}`, path: c.req.path, ephemeral: true });
  });
  v.forEach((_, month) => {
    const padding = (n: number, digit: number): string => { // なんとかしてくれ
      return ('0'.repeat(digit) + n).slice(-digit);
    };
    app.get(`/blog/${year}/${padding(month, 2)}/`, (c) => {
      const articles = blog.filter((a) => a.date.getFullYear() === year && a.date.getMonth() + 1 === month);
      return c.render(
        <BlogLinks blogInfo={blogInfo} canonical={canonical(c)} articles={articles} title={`Articles in ${year}/${month}(${articles.length})`} />
      , { title: `Articles in ${year}/${month}`, path: c.req.path, ephemeral: true });
    });
  });
});

app.get('/blog/feed.xml', (c) => {
  const articles = blog.slice(0, 10);
  const feed = new RSS({
    title: '/dev/nona',
    description: 'いっと☆わーくす！',
    site_url: 'https://nna774.net/blog/',
    feed_url: 'https://nna774.net/blog/feed.xml',
    language: 'ja',
    pubDate: articles[0].date.toUTCString(),
  });
  articles.forEach((a) => {
    feed.item({
      title: a.title,
      description: a.content,
      url: baseURI + a.path,
      author: '久我山菜々',
      date: a.date.toUTCString(),
      categories: a.tags,
    });
  });

  return new Response(feed.xml({ indent: true }), { status: 200, headers: { 'Content-Type': 'application/rss' } });
});

app.get('*', (c) => { return c.text(c.req.path); });

export default app;
