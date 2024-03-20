## Fess Site Searchについて

Fess Site Search(FSS)は[検索サーバFess](http://fess.codelibs.org/ja/)を既存のWebサイトに導入できる機能です。
FSSが提供するタグとJavaScriptファイルを利用して、運用しているWebサイトに検索ボックスおよび検索結果を表示することができます。
簡単に導入することができるので、Google Site SearchやGoogleカスタム検索などからもスムーズに移行することができます。

## ダウンロード

[FSS JS Generator](/generator)の[Generate]ボタンをクリックすると、FSSのJavaScriptファイルが生成されます。
Download JSボタンをクリックしてダウンロードしてください。

## 導入手順

FSSは以下の数ステップの手順だけで導入することができます。
FSSを利用するには事前にFessサーバを構築しておく必要があります。
構築済みのFessサーバを安価な[N2 Search ASP Super Lite](https://www.n2sm.net/services/n2search-asp-lite.html)として提供もしていますのでご検討ください。

### 新規にFSSを導入する場合

1. FSSのJavaScriptファイルをダウンロードし、ファイル名をfess-ss.min.jsにしてWebサイトに配置する
1. Webサイトに検索結果を表示するHTMLファイルを作成する (たとえばresult.html等)
1. 以下のコードを作成したHTMLファイルの`<body>`要素以下で検索ボックスを表示したい位置に追加する (fess-urlの値は検索サーバのURLに変更してください)
1. Webサイトの各ページに検索フォームを配置したい場合は、result.html?q=検索語 のように遷移するフォームを配置する

```html
<!-- FSS JSをロードします -->
<script src="fess-ss.min.js"></script>

<!-- FSSを設置します -->
<div id="fess-site-search" style="width:50%; margin-left: auto; margin-right: auto;">
  <fess-search-form
    language="ja"
  ></fess-search-form>
  <fess-search-result
    fess-url="http://localhost:18080"
    language="ja"
    link-target="_blank"
    :page-size="5"
    :enable-thumbnail="true"
  ></fess-search-result>
</div>
```

### Google Site Search(GSS)等から移行する場合

1. FSSのJavaScriptファイルをダウンロードし、ファイル名をfess-ss.min.jsにしてWebサイトに配置する
1. 以下のコードをGSSなどの検索結果を表示しているタグと置き換える (fess-urlの値は検索サーバのURLに変更してください)
1. Webサイトの各ページに検索フォームを配置している場合は、そのまま利用可能です

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
    fess.setAttribute('fess-url', 'https://search.n2sm.co.jp/json');
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

### 検索結果の表示件数を変更する場合
```javascript
fess.setAttribute('page-size', '20');
```

### 検索結果を別タブで表示する場合
```javascript
fess.setAttribute('link-target', '_blank');
```

### 言語を指定しての検索を行う場合
```javascript
fess.setAttribute('language', 'ja');
```

## デザインのカスタマイズ

FSS JS Generatorを利用して、デザインを修正することができます。

* Wizardタブのフォームに入力することで、背景色などを簡単にカスタマイズできます。
* Custom CSSタブでCSSをアップロードすることで、任意のCSSをFSSに適用できます。
    * FSSの画面構成については[FSS テンプレート](https://github.com/codelibs/fess-site-search/tree/master/fss/src/current/templates)を参照してください。
    * 標準で適用されているCSSについては[FSS CSS](https://github.com/codelibs/fess-site-search/tree/master/fss/src/current/css)を参照してください。

### サムネイルのサイズ変更

検索結果に表示するサムネイルサイズを変更したい場合はCSSで以下を指定して変更してください。
デフォルトのサイズは100pxです。

```css
.fessWrapper .thumbnail {
  width: 100px !important;
}

.fessWrapper .thumbnailBox {
  width: 100px !important;
}
```

## UTF-8以外のサイトでの利用

Shift\_JISなどのUTF-8以外のエンコーディングで作成されたサイトでは、既存のページに検索フォームを配置して検索する際に次のようにformタグを設定する必要があります。

```html
<form action="search.html" method="get"
  onsubmit="document.location=this.action+'?q='+encodeURIComponent(document.getElementById('query').value);return false">
  <input type="text" id="query" name="q" value="">
  <input type="submit" value="検索">
</form>
```

検索語を入力するinputタグにはid属性を設定して、formタグではonsubmit属性を指定して、action属性で指定された検索ページへ遷移します。


## Google Analytics連携

Google Analyticsで検索キーワードを集計するためには、[サイト内検索を設定する](https://support.google.com/analytics/answer/1012264)を参照して、サイト内検索の設定を有効にしてください。
クエリパラメータはqを指定してください。
また、検索結果ページ内で入力された検索キーワードを集計するためには、以下のようなコードをFSSのJavaScriptの上部あたりに追加してイベントの集計を有効にする必要があります。
```javascript
<script>
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-XXXXXXX-1', 'auto');
</script>
```

## 商用サポート

Fess は Apache ライセンスで提供されるオープンソース製品で、個人や商用向けでも無料でご自由にご利用いただけます。

Fess のカスタマイズや導入・構築などのサポートサービスが必要な場合は、[商用サポート(有償)](https://www.n2sm.net/products/n2search.html)をご覧ください。
また、検索品質やクロールが遅いなどのパフォーマンスチューニングも商用サポートで対応しています。

### N2 Search ASP Super Lite

[N2 Search ASP Super Lite](https://www.n2sm.net/services/n2search-asp-lite.html)は、Google Site Searchと同程度の価格帯で提供するサイト内検索サービスです。
Google Site SearchのJavaScriptを置き換えるだけでご利用いただけます。
