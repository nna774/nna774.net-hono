---
directory_index: false
title: なんやいろいろ調べてたメモ
date: 2014-10-25 06:26 JST
tags:
---

(途中出てくるWeb ページは、全て今日(2014-10-25) 見たものである。引用等も今日の時点のものである)

# AS15169
<blockquote class="twitter-tweet" lang="ja"><p>AS15169</p>&mdash; 綾波型駆逐艦のな[46/461] 10% (@nonamea774) <a href="https://twitter.com/nonamea774/status/525746438102593536">2014, 10月 24</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Google の所有するAS

[Geekなぺーじ:Googleのネットワーク構成を調べてみた](http://www.geekpage.jp/blog/?id=2009/9/1/2)

<blockquote class="twitter-tweet" lang="ja"><p><a href="http://t.co/dajrxSFgd1">http://t.co/dajrxSFgd1</a>(<a href="http://t.co/pWVlVCHbAF">http://t.co/pWVlVCHbAF</a>), うちの家からだと <a href="http://t.co/IaN5tddNf5">http://t.co/IaN5tddNf5</a> を経由してAS15169 に入って行く 10ms ぐらいでかえってくるし、大阪にデータセンタが有る？</p>&mdash; 綾波型駆逐艦のな[46/461] 10% (@nonamea774) <a href="https://twitter.com/nonamea774/status/525748251073728512">2014, 10月 24</a></blockquote>

これに対しては、[Google Global Cache](https://peering.google.com/about/ggc.html) なのでは と指摘を受けた。

# このへんのネットワーク、IX とか

## 京都IX
[KRP](http://www.krp.co.jp/it/) にあるらしい？ あるという噂をよく聞く。

京都IX でググっても、上記のページがTop に出てくる。

<blockquote>
KRPデータセンターの通信環境は完全なキャリアフリーです。自由にお客様ご指定の通信事業者の回線を引き込みできます。
</blockquote>

と[概要｜KRPデータセンター｜京都リサーチパーク株式会社](http://www.krp.co.jp/it/outline/index.html#h3-02) のページにも謳っているし(本日閲覧)、実際あるのだろうとおもう。

## 京都デジタル疏水ネットワーク

[京都デジタル疏水ネットワーク／京都府ホームページ](http://www.pref.kyoto.jp/it/10500042.html)

<blockquote>
教育、医療、防災、産業、行政等の府民生活のあらゆる場面における情報通信技術（ＩＴ）をより効率よく連携でき、皆様に活発に活用していただくためのネットワークが、京都府域をむすぶ高度情報通信基盤「京都デジタル疏水ネットワーク」です。
</blockquote>

と[概要｜KRPデータセンター｜京都リサーチパーク株式会社](http://www.krp.co.jp/it/outline/index.html#h5-02-01) (上記KRP のページと同ページ、本日閲覧) に書いてある。
<small>上の京都府ホームページだけを見てもいまいち良くわからない。</small><br />
上記ページによると、KRP にも接続拠点があるらしい。

こちらのページ、[府民満足最大化を支える情報基盤構築プラン（平成20年12月策定）](http://www.pref.kyoto.jp/it/1229408004360.html)(本日閲覧) には少し詳しいことが書いてある。<br />
今このページを読みなおしていて気付いたが、

<blockquote>
また、京都市が中心となって推進してきた京都リサーチパークの京都IXや大学間情報ネットワーク（Univnet）とも連携し、利便性や信頼性の向上を図っている。
</blockquote>

とあるので、やはりKRP に京都IX はあるらしい。

### ref

* [行政経営改革を支援する共同運用システムを府・市町村のすべてが活用 京都府 - 電子自治体ベストプラクティス](https://www.j-lis.go.jp/lasdec-archive/its/bestpractice/iso/q1.html)

## kyoto-Pnet

[kyoto-Pnet](http://www.picky.or.jp/)

トップページに
<blockquote>
京都情報基盤協議会の指導のもと, インターネットとの常時接続を提供するサービスです.
</blockquote>
とあるので、プロバイダ？

ネットワーク構成が"2004.8.30現在" と書いてあるし、接続サイト一覧にはKRP と株式会社たけびし の二つしか載っていない。

なんなのだろう。

## KyotoOne

kyoto-Pnetのネットワーク構成のページ([kyoto-Pnet Network Connection Map](http://www.picky.or.jp/network.html)) に
<blockquote>
KyotoOneは, 京都情報基盤協議会 により運営されている京都地域IX(Internet Exchange)です.
</blockquote>
とあるし、

[京都リサーチパーク - Wikipedia 2014-08-30T09:13:27 の版](https://ja.wikipedia.org/w/index.php?title=%E4%BA%AC%E9%83%BD%E3%83%AA%E3%82%B5%E3%83%BC%E3%83%81%E3%83%91%E3%83%BC%E3%82%AF&oldid=52726417) (現在の最新版) にも
リサーチパーク概要の項に、
<blockquote>
京都ONE（京都市が主導する地域IX）(略) などと接続し、京都のネットワーク基盤の拠点にもなっている。
</blockquote>
とある。

kyoto-Pnet から張られているリンクによるとKyotoOne のWeb ページは
[http://www.kyoto-one.ad.jp/](http://www.kyoto-one.ad.jp/) のURI を持つらしいが、
現在既に見れなくなっている。<br />
運営をしているらしい京都情報基盤協議会 [http://www.kiic.or.jp/](http://www.kiic.or.jp/)
もデッドリンクである。

ググってもよくわからん。

### ref

#### [京都市情報館 - 市長記者会見](http://www.city.kyoto.jp/koho/mayor/press/2001/0116.html)

これを読むにKRP にあったようだし、京都IX の前身とかだったのかなぁ

#### [インターネットエクスチェンジ - Wikipedia 2014-08-01T10:40:13 の版](https://ja.wikipedia.org/w/index.php?title=%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%BC%E3%83%8D%E3%83%83%E3%83%88%E3%82%A8%E3%82%AF%E3%82%B9%E3%83%81%E3%82%A7%E3%83%B3%E3%82%B8&oldid=52455222)

IXの一覧 > 日本国内の地域IX > Kyoto-One<br />
と名前が出ている。

#### [設立趣旨 | ITコンソーシアム京都](http://www.it-kyoto.jp/overview/estab)

<blockquote>
(略) Kyoto-pnetの運営や京都ONE構想に基づく大学間情報ネットワークや京都IXの構築、京都デジタル疏水ネットワークによる京都府全域での情報通信基盤の整備など (略)
</blockquote>

## NCA5

[NCA5（第5地区ネットワークコミュニティ）](http://www.nca5.ad.jp/)

<blockquote>
NCA5（Network Community Area 5）は，正式名称を第五地区ネットワークコミュニティといい，主として“第5地区”の大学等を対象とするネットワークコミュニティです．
</blockquote>

[NCA5（第5地区ネットワークコミュニティ） » NCA5について](http://www.nca5.ad.jp/information/) より引用

ページのフッタを見るに、京都大学学術情報メディアセンター北館 に事務局が置かれてるらしい。

SINET に繋がったネットワーク？

私はKDDI の回線を使っているが、
[NCA5（第5地区ネットワークコミュニティ） » NCA5加入機関一覧](http://www.nca5.ad.jp/information/members/) の
中の一部のホストまではSINET を経由して到達する。

    $ traceroute -A www.KYOHAKU.GO.JP
    traceroute to www.KYOHAKU.GO.JP (202.223.183.4), 30 hops max, 60 byte packets
    1  doroid.nna774.net (10.8.8.11) [AS65534]  0.998 ms  2.070 ms  2.163 ms
    2  router.nna774.net (10.8.8.1) [AS65534]  3.552 ms  3.973 ms  10.085 ms
    3  obpBBAR004-1.bb.kddi.ne.jp (106.162.245.225) [AS2516]  13.501 ms  18.629 ms  19.090 ms
    4  obpBBAC03.bb.kddi.ne.jp (111.87.218.245) [AS2516]  19.497 ms obpBBAC03.bb.kddi.ne.jp (182.248.175.197) [AS2516]  28.013 ms obpBBAC0
    3.bb.kddi.ne.jp (111.87.218.245) [AS2516]  19.750 ms
    5  sjkBBAC05.bb.kddi.ne.jp (125.53.105.185) [AS2516]  29.679 ms  30.064 ms  30.349 ms
    6  otejbb205.int-gw.kddi.ne.jp (210.234.250.9) [AS2516]  28.293 ms  19.603 ms  17.966 ms
    7  ix-ote206.int-gw.kddi.ne.jp (106.187.6.58) [AS2516]  19.185 ms ix-ote206.int-gw.kddi.ne.jp (106.187.6.50) [AS2516]  31.698 ms ix-ot
    e206.int-gw.kddi.ne.jp (106.187.6.54) [AS2516]  29.785 ms
    8  as2907.ix.jpix.ad.jp (210.171.224.150) [AS7527]  32.135 ms  32.126 ms  32.032 ms
    9  tokyo-dc-rm-ae4-vlan10.s4.sinet.ad.jp (150.99.2.53) [AS2907]  31.992 ms  31.647 ms  31.956 ms
    10  osaka-dc-rm-ae7-vlan10.s4.sinet.ad.jp (150.99.2.98) [AS2907]  32.077 ms  56.675 ms  56.453 ms
    11  kyohaku.gw.sinet.ad.jp (150.99.186.130) [AS2907]  37.795 ms  37.621 ms  37.970 ms
    12  * * *

以下ずっと * * *

### ref

[KUINS News No.44](http://www.kuins.kyoto-u.ac.jp/news/44/)

## さいご

よくわからなくなってきたしねむくなってきたし、とりあえず見たページのリンクを残して終ろうとおもう。

### [Hurricane Electric BGP Toolkit](http://bgp.he.net/)

printf("http://bgp.he.net/%s", "AS0000") のURI は便利であった。

### [JPIX:JaPan Internet eXchange ｜ 日本インターネットエクスチェンジ株式会社](http://www.jpix.ad.jp/)

### [PDF注意] [http://www.wide.ad.jp/project/document/reports/pdf2008/part32.pdf](http://www.wide.ad.jp/project/document/reports/pdf2008/part32.pdf)

とりあえずこれぐらいで。

なにかあったら教えてください。

<small>Google の主要サービスへのtraceroute 定期的に保存してたらおもしろいのではないか 的なことこのあいだの8.8.8.8 が止った時とかに思ったの思い出した。</small>
