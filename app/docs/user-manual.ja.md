# 利用方法

## FSSについて

Fess Site Search(FSS)を利用して、Webサイトに[検索エンジンFess](http://fess.codelibs.org/ja/)の検索ボックスを追加することができます。
(Fessサーバは事前に構築しておく必要があります)

## ダウンロード

[FSS JS Generator](/)の[Generate!]ボタンをクリックすると、FSSのJavaScriptファイルが生成されます。
Download JSボタンをクリックしてダウンロードしてください。

## クイックスタート

以下の手順で簡単にFessを追加できます。

1. FSS JSをダウンロードし、ファイル名をfess-ss.min.jsにしてWebサイトに配置します。
1. 以下のコードをWebサイトの検索結果を表示したいページの`<body>`要素の検索ボックスを表示する位置に追加します。(fess-urlの値は検索サーバのURLに変更してください)

```html
<script>
  (function() {
    var fess = document.createElement('script');
    fess.type = 'text/javascript';
    fess.async = true;
    // FSS JSのURLをsrcに設定します
    fess.src = 'fess-ss.min.js';
    fess.charset = 'utf-8';
    fess.setAttribute('id', 'fess-ss');
    // Fessの検索APIのURLをfess-urlに設定します
    fess.setAttribute('fess-url', 'http://search.n2sm.co.jp/json');
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(fess, s);
  })();
</script>

<fess:search></fess:search>
```

## 検索結果の表示種類

検索結果の表示方法は利用するタグにより変更できます。
次の3パターンでの表示が可能です。

* 検索フォームと検索結果を表示します。
```html
<fess:search></fess:search>
```
* 検索フォームだけを表示します。
```html
<fess:search-form-only></fess:search-form-only>
```
* 検索結果だけを表示します。
```html
<fess:search-result-only></fess:search-result-only>
```

## オプション

script中の `fess.setAttribute('fess-url', '{fess url}');` の下に以下のコードを追加することで、FSSの検索オプションを利用出来ます。

* ラベル絞り込み検索を行うフォームを表示します。
```javascript
fess.setAttribute('enable-labels', 'true');
```
* 検索結果をポップアップで表示します。
```javascript
fess.setAttribute('popup-result', 'true');
```
* 検索結果に関連クエリー/関連コンテンツを表示します。
```javascript
fess.setAttribute('enable-related', 'true');
```
* 検索結果のソートを非表示にします。
```javascript
fess.setAttribute('enable-order', 'false');
```
* 検索を実行した際に、指定したURLへページ遷移します。`fess:search-form-only`で検索フォームだけを表示して、検索結果は別のページで表示する場合に利用します。
```javascript
fess.setAttribute('fess-search-page-path', 'result.html');
```

## デザインのカスタマイズ

FSS JS Generatorを利用して、デザインを修正することが出来ます。

* Wizardタブのフォームに入力することで、背景色などを簡単にカスタマイズ出来ます。
* Upload CSSタブでCSSをアップロードすることで、任意のCSSをFSSに適用出来ます。
    * FSSの画面構成については[FSS テンプレート](https://github.com/codelibs/fess-site-search/tree/master/fss/11.4/src/templates)を参照してください。
    * 標準で適用されているCSSについては[FSS CSS](https://github.com/codelibs/fess-site-search/tree/master/fss/11.4/src/css)を参照してください。

## 商用サポート

商用サポートではFessの構築支援やFessサーバを低価格で提供しています。
[商用サポートについて](http://fess.codelibs.org/ja/support-services.html)を参照してください。
