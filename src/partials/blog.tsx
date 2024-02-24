import { raw } from 'hono/html';
import { Child, PropsWithChildren } from 'hono/jsx';

export type BlogType = {
  individual?: boolean;
  path: string;
  title: string;
  content: string;
  date: Date;
  tags?: string[];
};

export type BlogInfoType = {
  blog: BlogType[];
  tags: Map<string, number>;
};

const padding = (n: number, digit: number): string => {
  return ('0'.repeat(digit) + n).slice(-digit);
};

const dateFormater = (d: Date): string => {
  return d.getFullYear() + '/' + padding((d.getMonth() + 1), 2) + '/' + padding(d.getDate(), 2);
};

const tag_path = (tag: string): string => {
  return '/blog/tag/' + tag.toLowerCase() + '/';
};

const ArticleHeader = ({props}: {props: BlogType}, individual: boolean) => (
  <header class='articleMeta'>
    <h1 class='articleTitle' itemprop='name'>
      <a href={props.path} itemprop='url'>{props.title}</a>
    </h1>
    <time datetime={props.date.toISOString()} itemprop='datePublished'>
      {dateFormater(props.date)}
    </time>
    <span itemprop='author' itemscope itemtype='http://schema.org/Person'><a rel='author' href='/about/' itemprop='url'><span itemprop='name'>久我山菜々</span></a></span>
    <a href={props.path}>parmalink</a>
    {props.tags && (
      <span class='tags'> Tags:
        {props.tags.map((tag) => (
          <a href={tag_path(tag)} rel='tag' itemprop='keywords'>{tag}</a>
        ))}
      </span>
    )}
    { !!individual && (
      <span class='socialBookmarks'>
        <a href='http://b.hatena.ne.jp/entry/<%= base_url %><%= current_article.url %>' class='hatena-bookmark-button' data-hatena-bookmark-title='<%= current_article.title %>' data-hatena-bookmark-layout='standard-balloon' data-hatena-bookmark-lang='ja' title='このエントリーをはてなブックマークに追加'><img src='https://b.hatena.ne.jp/images/entry-button/button-only.gif' alt='このエントリーをはてなブックマークに追加' width='20' height='20' style='border: none;' /></a>
        <script type='text/javascript' src='https://b.hatena.ne.jp/js/bookmark_button.js' charset='utf-8' async></script>
        <a href='https://twitter.com/share' class='twitter-share-button' data-url='<%= base_url %><%= current_article.url %>' data-via='nonamea774' data-lang='ja'>ツイート</a>
      </span>
    )}
  </header>
);

export const BlogArticle = ({props}: { props: BlogType }, individual?: boolean) => (
  <article>
    <ArticleHeader props={props} />
    <div class='articleBody'>
      {raw(props.content)}
    </div>
  </article>
);

const BlogHeader = () => (
  <header role='banner' id='head' class='row center'>
    <div id='banner' class='col-lg-10 col-lg-push-2 col-md-9 col-md-push-3'>
      <h1><a href='/blog/' rel='index'>/dev/nona (いっと☆わーくす！)</a></h1>
      <p id='onepoint'>##### Onepoint #####</p>
      <nav id='headerMenu'>
        <span class='headerMenuElem'><a href='/' rel='index'><span class='sprite-1012 sp-h'></span>top</a></span>
        <span class='headerMenuElem'><a href='/blog/feed.xml' rel='alternate'><span class='sprite-feed sp-h'></span>feed</a></span>
        <span class='headerMenuElem'><a href='/OpenYo/'><span class='sprite-OpenYo sp-h'></span>OpenYo</a></span>
      </nav>
      <nav id='jumpToSide' class='hidden-md hidden-lg'>
        <a href='#sideBar'>めにゅーへ</a>
      </nav>
    </div>
    <div id='img' class='col-lg-2 col-lg-pull-10 col-md-3 col-md-pull-9 hidden-sm hidden-xs'>
      <a href='/blog/' rel='index'>
        <picture>
          <source type='image/webp' srcset='/img/1012-159x.webp' />
          <img src='/img/1012-159x.png' width='159' height='150' alt="nona's icon." />
        </picture>
      </a>
    </div>
  </header>
);

const ArticleLink = ({article}: {article: BlogType}) => (
  <>
    <a href={article.path}>
      {article.title}
    </a>

    {article.date.toLocaleDateString('default', { month: 'short' })} {article.date.getDate()}
  </>
);

const SideBarChild = ({children, name, to, id}: {children: Child, name: string, to?: string, id?: string}) => (
  <div class='col-md-12 col-sm-4 col-xs-6' id={id}>
    <h2>{ to ? <a href={to} >{name}</a> : name }</h2>
    {children}
  </div>
);

const BlogSidebar = ({blogInfo}: {blogInfo: BlogInfoType}) => (
  <nav id='sideBar' class='col-lg-2 col-lg-pull-10 col-md-3 col-md-pull-9'>
    <div class='row'>
      <SideBarChild name='Recent Articles' children={
        <ol>
          {blogInfo.blog.slice(0, 10).map((article) => <li><ArticleLink article={article} /></li>)}
        </ol>
      } />
      <SideBarChild name='Tags' to={'/blog/tag/'} children={
        <ul>
          { [...blogInfo.tags || []].sort((a, b) => a[1] - b[1]).reverse().map(([tag, count]) =>
            <li><a href={tag_path(tag)}>{tag}</a> ({count})</li>
          )}
        </ul>
      } />
      <SideBarChild name='Archive' children={
        <ul>
          ##### Archive #####
        </ul>
      } />
      <SideBarChild name='Profile' children={
        <ul>
          <li>
            <a rel='author' href='/about/' >久我山菜々</a>
          </li>
          <li>
            <a rel='author' href='https://twitter.com/nonamea774' >@nonamea774</a>
          </li>
        </ul>
      } />

      <SideBarChild name='License' id='id' children={
        <>
          <p>
            Unless otherwise noted,<br />
            Copyright (C) 2014- 久我山菜々(NNN77)<br />
            Permission is granted to copy, distribute and/or modify this document under the terms of <a rel='license' href='https://www.gnu.org/licenses/fdl.html'>the GNU Free Documentation License, Version 1.3 or any later version</a> published by the Free Software Foundation; with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts.<br />
            ただし、必要である範囲において他の著作物を引用していることがあります。
          </p>
          <p>
            <a rel='license' href='https://creativecommons.org/licenses/by-sa/3.0/'>
              <img alt='Creative Commons License' style='border-width:0' src='/img/cc-by-sa_88x31.png' width='88' height='31' />
            </a><br />
            And, this work is licensed under a <a rel='license' href='https://creativecommons.org/licenses/by-sa/3.0/'>Creative Commons Attribution-ShareAlike 3.0 Unported License</a> or <a rel='license' href='https://creativecommons.org/licenses/by-sa/4.0/'>Creative Commons Attribution-ShareAlike 4.0 International</a>.
          </p>
        </>
      } />
    </div>
  </nav>
);

export const BlogBody = ({blogInfo, canonical, children}: PropsWithChildren<{blogInfo: BlogInfoType, canonical: string}>) => {
  return (
    <body class='container-fluid'>
      <BlogHeader />
      <div id='wrap' class='row'>
        <main role='main' class='col-lg-10 col-lg-push-2 col-md-9 col-md-push-3'>
          {children}
        </main>

        <BlogSidebar blogInfo={blogInfo} />
      </div>
      <myFooter canonical={canonical} />
    </body>
  );
};

export const makeInfo = (blog: BlogType[]): BlogInfoType => {
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