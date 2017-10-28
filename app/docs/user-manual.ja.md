# 利用方法

## Fess Site Searchについて

Fess Site Search(FSS)は[検索サーバFess](http://fess.codelibs.org/ja/)を既存のWebサイトに導入できる機能です。
FSSが提供するタグとJavaScriptファイルを利用して、運用しているWebサイトに検索ボックスおよび検索結果表を表示することができます。
簡単に導入することができるので、Google Site SearchやGoogleカスタム検索などからもスムーズに移行することができます。

## ダウンロード

[FSS JS Generator](/)の[Generate!]ボタンをクリックすると、FSSのJavaScriptファイルが生成されます。
Download JSボタンをクリックしてダウンロードしてください。

## 導入手順

FSSは以下の数ステップの手順だけで導入することができます。
FSSを利用するには事前にFessサーバを構築しておく必要があります。
構築済みのFessサーバを安価な[N2 Search ASP Super Lite](http://www.n2sm.net/services/n2search-asp-lite.html)として提供もしていますのでご検討ください。

### 新規にFSSを導入する場合

1. FSSのJavaScriptファイルをダウンロードし、ファイル名をfess-ss.min.jsにしてWebサイトに配置する
1. Webサイトに検索結果を表示するHTMLファイルを作成する (たとえばresult.html等)
1. 以下のコードを作成したHTMLファイルの`<body>`要素以下で検索ボックスを表示したい位置に追加する (fess-urlの値は検索サーバのURLに変更してください)
1. Webサイトの各ページに検索フォームを配置したい場合は、result.html?q=検索語 のように遷移するフォームを配置する

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

### Google Site Search(GSS)等から移行する場合

1. FSSのJavaScriptファイルをダウンロードし、ファイル名をfess-ss.min.jsにしてWebサイトに配置する
1. 以下のコードをGSSなどの検索結果を表示しているタグと置き換える (fess-urlの値は検索サーバのURLに変更してください)

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

### 検索フォームと検索結果を表示
```html
<fess:search></fess:search>
```

### 検索フォームだけを表示
```html
<fess:search-form-only></fess:search-form-only>
```

### 検索結果だけを表示
```html
<fess:search-result-only></fess:search-result-only>
```

## オプション

script中の `fess.setAttribute('fess-url', '{fess url}');` の下に以下のコードを追加することで、FSSの検索オプションを利用できます。

### ラベル絞り込み検索を行うフォームを表示する場合
```javascript
fess.setAttribute('enable-labels', 'true');
```

### 検索結果をポップアップで表示する場合
```javascript
fess.setAttribute('popup-result', 'true');
```

### 検索結果に関連クエリー/関連コンテンツを表示する場合
```javascript
fess.setAttribute('enable-related', 'true');
```

### サジェストを利用する場合
```javascript
fess.setAttribute('enable-suggest', 'true');
```

### 検索結果のソートを非表示にする場合
```javascript
fess.setAttribute('enable-order', 'false');
```

### 検索結果のサムネイルを非表示にする場合
```javascript
fess.setAttribute('enable-thumbnail', 'false');
```
### 検索結果ページへ遷移させたい場合
検索を実行した際に、指定したURLへページ遷移します。
`fess:search-form-only`で検索フォームだけを表示して、検索結果は別のページで表示する場合に利用します。
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
