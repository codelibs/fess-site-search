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

1. FSSのJavaScriptファイルをダウンロードし、ファイル名をfess-ss.jsにしてWebサイトに配置する
1. Webサイトに検索結果を表示するHTMLファイルを作成する (たとえばresult.html等)
1. 以下のコードを作成したHTMLファイルの`<body>`要素以下で検索ボックスを表示したい位置に追加する (fess-urlの値は検索サーバのURLに変更してください)
1. Webサイトの各ページに検索フォームを配置したい場合は、result.html?fss.query=検索語 のように遷移するフォームを配置する

```html
<!-- FSS JSをロードします -->
<script src="fess-ss.js"></script>

<!-- FSSを設置します -->
<div class="fess-site-search">
  <fess-search-form
    language="ja"
  ></fess-search-form>
  <fess-search-result
    fess-url="https://search.n2sm.co.jp"
  ></fess-search-result>
</div>
```

## 検索結果の表示種類

検索結果の表示方法は利用するタグにより変更できます。
次の3パターンでの表示が可能です。

### 検索フォームと検索結果を表示
```html
<div class="fess-site-search">
  <fess-search-form
  ></fess-search-form>
  <fess-search-result
    fess-url="https://search.n2sm.co.jp"
  ></fess-search-result>
</div>
```

### 検索フォームだけを表示
```html
<div class="fess-site-search">
  <fess-search-form
    result-page="検索結果ページのパス"
  ></fess-search-form>
</div>
```

### 検索結果だけを表示
```html
<div class="fess-site-search">
  <fess-search-result
    fess-url="https://search.n2sm.co.jp"
  ></fess-search-result>
</div>
```

## オプション

### fess-search-form (検索フォーム)
fess-search-formに以下の属性を追加することで、FSSの検索フォームオプションを利用できます。

#### 言語を設定する場合
```html
language="ja"
```

#### サジェストを利用する場合
```html
:enable-suggest="true"
suggest-url="https://search.n2sm.co.jp"
```

#### 検索時に別のページへ移動する場合
```html
result-page="result.html"
```

### fess-search-result (検索結果)
fess-search-resultに以下の属性を追加することで、FSSの検索結果オプションを利用できます。

#### ラベル絞り込み検索を行うフォームを表示する場合
```html
:enable-label="true"
```

#### ラベル絞り込み検索を行うタブを表示する場合
```html
:enable-label-tab="true"
```

#### 検索結果に関連クエリー/関連コンテンツを表示する場合
```html
:enable-related="true"
```

#### 検索結果のソートを非表示にする場合
```html
:enable-order="false"
```

#### 検索結果のサムネイルを非表示にする場合
```html
:enable-thumbnail="false"
```

#### 検索結果の表示件数を変更する場合
```html
:page-size="20"
```

#### 検索結果のリンク先を別タブで開く場合
```html
link-target="_blank"
```

#### 言語を指定して検索する場合
```html
language="ja"
```

## デザインのカスタマイズ

FSS JS Generatorを利用して、デザインを修正することができます。

* Wizardタブのフォームに入力することで、背景色などを簡単にカスタマイズできます。
* Custom CSSタブでCSSをアップロードすることで、任意のCSSをFSSに適用できます。

### サムネイルのサイズ変更

検索結果に表示するサムネイルサイズを変更したい場合はCSSで以下を指定して変更してください。
デフォルトのサイズは100pxです。

```css
.fess-site-search .thumbnail {
  width: 100px !important;
}
```

## UTF-8以外のサイトでの利用

Shift\_JISなどのUTF-8以外のエンコーディングで作成されたサイトでは、既存のページに検索フォームを配置して検索する際に次のようにformタグを設定する必要があります。

```html
<form action="search.html" method="get"
  onsubmit="document.location=this.action+'?fss.query='+encodeURIComponent(document.getElementById('query').value);return false">
  <input type="text" id="query" name="fss.query" value="">
  <input type="submit" value="検索">
</form>
```

検索語を入力するinputタグにはid属性を設定して、formタグではonsubmit属性を指定して、action属性で指定された検索ページへ遷移します。


## Google Analytics連携

Google Analyticsで検索キーワードを集計するためには、[サイト内検索を設定する](https://support.google.com/analytics/answer/1012264)を参照して、サイト内検索の設定を有効にしてください。
クエリパラメータはfss.queryを指定してください。
また、検索結果ページ内で入力された検索キーワードを集計するためには、以下のようなコードをページの上部あたりに追加してイベントの集計を有効にする必要があります。
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
