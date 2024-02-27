---
title: nna774.netをHonoで書き直した。
date: 2024-02-27 21:20 JST
tags: Middleman, Hono
---

nna774.net(つまり、このページのこと)を[Hono](https://hono.dev/)で書き直した。

今までは[middleman](https://github.com/middleman/middleman), [middleman-blog](https://github.com/middleman/middleman-blog)を使って書いてたが、手元でビルドが成功しない状況が続いていた。

一方並行してHonoの話を[イベントで何度か聞いていた](https://scrapbox.io/rebuild-kitashirakawa/YAPC::Hiroshima_2024%E3%81%AB%E5%8F%82%E5%8A%A0%E3%81%97%E3%81%A6%E3%81%8D%E3%81%BE%E3%81%97%E3%81%9F%E3%80%82#65cc6449afd392000058c6c1)。
それがv4でついにSSG(Server Side Generation)に対応したということで、乗換えてみることにした。

いくつかの問題があるものの、一旦全てworkaroundすることができたので、乗り換えることに成功した。

## 気付いている問題

```javascript
app.get('/パス/', ...)
```

のようなパスにマルチバイト文字列を渡した場合、内部には/パス/のように登録されるが、アクセスする際に/%E3%83%91%E3%82%B9/のようにエンコードされるためか、マッチされない。

[encodeURI](https://github.com/nna774/nna774.net-hono/blob/71881da85d2e2cd599c7b88620a3fc00fdd24839/src/partials/blog.tsx#L33)したパスを登録して、[ファイルに書き出す際にdecodeURI](https://github.com/nna774/nna774.net-hono/blob/71881da85d2e2cd599c7b88620a3fc00fdd24839/build.ts#L8-L16)することでごまかしている。

```javascript
app.get('/feed.xml', ...)
```
のようなコードからSSGすると、feed.xml.htmlが生成される。
[https://github.com/honojs/hono/pull/2236](https://github.com/honojs/hono/pull/2236)によって直っているように思うのだが、これを含んだバージョンを使っても発生する。index.html.htmlのようにhtmlが2つにはならなくなったのに。
[ビルド後にrename](https://github.com/nna774/nna774.net-hono/blob/71881da85d2e2cd599c7b88620a3fc00fdd24839/build.ts#L36-L37)でごまかしている。

踏んだものはこれぐらいか。

## 普段

普段はScrapboxのほうにブログを書いているが、ひさしぶりにこちらを更新するのもわるくない感じがするので、記事を書く際にはこっちを使ってもいいのかもしれない……と思ってきた。
最後の記事が2018年か……という気持ちにはなってしまった。
