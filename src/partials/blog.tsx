import { raw } from 'hono/html';
import { Child, PropsWithChildren } from 'hono/jsx';

export type BlogType = {
  individual?: boolean;
  path: string;
  canonical: string;
  title: string;
  content: string;
  date: Date;
  tags?: string[];
};

export type BlogInfoType = {
  blog: BlogType[];
  tags: Map<string, number>;
  monthly: Map<number, Map<number, number>>; // year, month, count
};

const padding = (n: number, digit: number): string => {
  return ('0'.repeat(digit) + n).slice(-digit);
};

const dateFormater = (d: Date): string => {
  return d.getFullYear() + '/' + padding((d.getMonth() + 1), 2) + '/' + padding(d.getDate(), 2) + ' ' + padding(d.getHours(), 2) + ':' + padding(d.getMinutes(), 2);
};

export const tag_path = (tag: string): string => {
  const removeSlash = (s: string) => {
    if (s.startsWith('/')) { s = s.substring(1); }
    return s.replaceAll('/', '-');
  };
  return '/blog/tags/' + removeSlash(encodeURI(tag.toLocaleLowerCase())) + '/';
};

const ArticleHeader = ({props, individual}: {props: BlogType, individual?: boolean}) => (
  <header class='articleMeta'>
    <h1 class='articleTitle' itemprop='name'>
      <a href={props.path} itemprop='url'>{props.title}</a>
    </h1>
    <time datetime={props.date.toISOString()} itemprop='datePublished'>
      {dateFormater(props.date)}
    </time>{' '}
    <span itemprop='author' itemscope itemtype='http://schema.org/Person'>
      <a rel='author' href='/about/' itemprop='url'><span itemprop='name'>久我山菜々</span></a>
    </span>{' '}
    <a href={props.path}>parmalink</a>{' '}
    { props.tags && (
      <span class='tags'>Tags:{' '}
        {props.tags.map((tag) => (
          <><a href={tag_path(tag)} rel='tag' itemprop='keywords'>{tag}</a>{' '}</>
        ))}
      </span>
    )}
    { individual && (
      <span class='socialBookmarks'>
        <a href={'http://b.hatena.ne.jp/entry/' + props.canonical} class='hatena-bookmark-button' data-hatena-bookmark-title='<%= current_article.title %>' data-hatena-bookmark-layout='standard-balloon' data-hatena-bookmark-lang='ja' title='このエントリーをはてなブックマークに追加'><img src='https://b.hatena.ne.jp/images/entry-button/button-only.gif' alt='このエントリーをはてなブックマークに追加' width='20' height='20' style='border: none;' /></a>{' '}
        <script type='text/javascript' src='https://b.hatena.ne.jp/js/bookmark_button.js' charset='utf-8' async></script>
        <a href='https://twitter.com/share' class='twitter-share-button' data-url={props.canonical} data-via='nonamea774' data-lang='ja'>ツイート</a>
      </span>
    )}
  </header>
);

const ArticleFooter = ({date}: {date: Date}) => (
  <footer class='articleMeta'>
    Witten by <a rel='author' href='/about/' >久我山菜々</a><br />
    何かツッコミ、意見、便利知見等あれば、<a rel='author' href='https://twitter.com/nonamea774/' >@nonamea774</a>、<a rel='author' href='mailto:nonamea774@gmail.com' >nonamea774@gmail.com</a>までご気軽にお願いします。<br />
    <time datetime="<%= current_article.date.strftime('%Y-%m-%dT%R%z') %>">{dateFormater(date)}</time>
  </footer>
);

export const BlogArticle = ({props, individual}: { props: BlogType, individual?: boolean }) => (
  <article>
    <ArticleHeader props={props} individual={individual} />
    <div class='articleBody'>
      {raw(props.content)}
    </div>
    { individual && <ArticleFooter date={props.date} /> }
  </article>
);

const Onepoint = ({canonical}: {canonical: string}) => {
  const onepoints: Child[] = [
    'あなたの予想に反して、このページが見えているでしょうか?',
    'Меня зовут Нана. А вас?',
    <a href='https://www.youtube.com/watch?v=PqJNc9KVIZE'>Tell Your World</a>,
    <a href='/OpenYo/'>Yo!</a>,
    <a href='http://wayback.archive.org/web/20140823220053/http://theinterviews.jp/retlet/13554'>ぐるぐると回り続けて、そのうちぼくらはバターになる。</a>,
    <a href='http://www.sham.jp/studio/sound/denki/'>僕らはみんな電気の恋人</a>,
    <a href='https://twitter.com/nonamea774/status/625535338589483009'>📛</a>,
    'コンピュータと心中する覚悟は出来ましたか？',
    <a href='https://www.youtube.com/@hapiene'>明日のあなたがエネルギーで幸せになりますように。</a>,
  ];
  let i = Math.floor(Math.random() * onepoints.length);
  if (canonical === 'https://nna774.net/blog/') {
    i = 0;
  }
  return <p id='onepoint'>{onepoints[i]}</p>;
};

const BlogHeader = ({canonical}: {canonical: string}) => (
  <header role='banner' id='head' class='row center'>
    <div id='banner' class='col-lg-10 col-lg-push-2 col-md-9 col-md-push-3'>
      <h1><a href='/blog/' rel='index'>/dev/nona (いっと☆わーくす！)</a></h1>
      <Onepoint canonical={canonical} />
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

const shortMonth = (m: number): string => {
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m];
};

const ArticleLink = ({article}: {article: BlogType}) => (
  <>
    <a href={article.path}>
      {article.title}
    </a>
    {' '}
    {shortMonth(article.date.getMonth())} {article.date.getDate()}
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
      <SideBarChild name='Tags' children={
        <ul>
          { [...blogInfo.tags || []].sort((a, b) => a[1] - b[1]).reverse().map(([tag, count]) =>
            <li><a href={tag_path(tag)}>{tag}</a> ({count})</li>
          )}
        </ul>
      } />
      <SideBarChild name='Archive' children={
        <ul>
          {
            [...blogInfo.monthly].sort((a, b) => a[0] - b[0]).reverse().map(([year, monthly]) =>
              <li>
                <a href={'/blog/' + year + '/' }>{year}</a>({[...monthly].map(([_, count]) => count).reduce((a, b) => a + b)})
                <ul>
                  {[...monthly].sort((a, b) => a[0] - b[0]).reverse().map(([month, count]) =>
                    <li><a href={'/blog/' + year + '/' + padding(month, 2) + '/'}>{shortMonth(month - 1)}</a>({count})</li> // ここは1から始まっている。
                  )}
                </ul>
              </li>
            )
          }
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
    <>
      <BlogHeader canonical={canonical} />
      <div id='wrap' class='row'>
        <main role='main' class='col-lg-10 col-lg-push-2 col-md-9 col-md-push-3'>
          {children}
        </main>

        <BlogSidebar blogInfo={blogInfo} />
      </div>
    </>
  );
};

export const BlogLinks = ({blogInfo, canonical, articles, title}: {blogInfo: BlogInfoType, canonical: string, articles: BlogType[], title: string}) => (
  <BlogBody blogInfo={blogInfo} canonical={canonical}>
    <h1>{title}</h1>
    <ul>
      {articles.map((a) => <li><ArticleLink article={a}></ArticleLink></li>)}
    </ul>
  </BlogBody>
);

export const ArticleChain = (pastArticle?: BlogType, futureArticle?: BlogType) => (
  <p class='articleChain'>
    <span style={{width: '50%', display: 'inline'}}>
      { pastArticle ? <a href={pastArticle.path} >&lt;&lt; 過去の記事({pastArticle.title})</a> : '<< 過去の記事' }
    </span>
    { ' | ' }
    <span style={{width: '50%', display: 'inline'}}>
      { futureArticle ? <a href={futureArticle.path} >未来の記事({futureArticle.title}) &gt;&gt;</a> : '未来の記事 >>' }
    </span>
  </p>
);

export const PageChain = (pageNumber: number, maxPage: number, hasPast: boolean, hasFuture: boolean) => (
  <p class='pageChain'>
    { hasPast ? <a href={`/blog/page/${pageNumber + 1}/`} >過去のページ</a> : '過去のページ' }{ ' ' }
    Page {pageNumber} of {maxPage}{ ' ' }
    { hasFuture ? <a href={`/blog/page/${pageNumber - 1}/`} >未来のページ</a> : '未来のページ' }
  </p>
);

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
    monthly: blog.reduce((acc, b) => {
      const y = b.date.getFullYear();
      const m = b.date.getMonth() + 1;
      const v = acc.get(y) || new Map<number, number>();
      const vv = v.get(m);
      if (!vv) {
        v.set(m, 1);
      } else {
        v.set(m, vv + 1);
      }
      acc.set(y, v);
      return acc;
    }, new Map<number, Map<number, number>>())
  };
};
