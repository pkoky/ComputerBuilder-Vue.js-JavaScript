https://pkoky.github.io/ComputerBuilder-Vue.js-JavaScript/

<h1 align="center">Computer Builder</h1>

<!-- ![newdemo]() -->

---

見ていただきありがとうございます。

**目次**

1. ページの URL
2. Project 制作の経緯/概要
3. 使用言語/ツール
4. 遊び方
5. 拘ったポイント
6. 躓いたポイント

---

**URL**

https://pkoky.github.io/ComputerBuilder-Vue.js-JavaScript/

<h2>Project制作の経緯/概要</h2>

コンピュータサイエンス学習プラットフォーム、[Recursion](https://recursionist.io/dashboard/users/koky) でコンピューターサイエンスを学んでいます。

CS の基礎を学んだ後 API の扱い方を学び、そのアウトプットとして制作しました。  
今回 [Tailwind.css](https://tailwindcss.jp/) を初めて使い開発しました。

Project の概要

```
- ユーザーがCPU、GPU、メモリーカード（RAM）、ストレージ（HDDまたはSSD）を選択してコンピュータを構築し、最終的なスコアに基づいて性能を比較するアプリケーション。
- 各カテゴリタイプの上位100製品のデータセットが提供されているAPIから取得したデータを使用。
```



<h2>使用言語/ツール</h2>

- HTML
- [Tailwind.css](https://tailwindcss.jp/)
- JavaScript
- [Vue.js](https://jp.vuejs.org/index.html)

<h2>使用方法</h2>
CPU,GPU、メモリーカード、ストレージの各項目を選択します。  
その後「性能を見てみる」ボタンをクリックし性能を見てみましょう。  
新しいコンピュータは順に下に追加されていくので、  
複数のコンピュータを作成して性能を比較してみましょう。  


> 選択の順序は問いませんが、左の項目から選択していく必要があります。   
> 選択された情報をもとに次の選択しがセットされるためです。


<h2>拘ったポイント</h2>

<details>
<summary>見た目のデザインについて</summary>
<div>

- 配色  
   [こちらのサイト](http://hue360.herokuapp.com/)を参考に補色の関係や相性のいい色から３種類を選択しました。  
   １種類につき濃淡の差で4つ選択し、tailwind.configに登録し使用しました。

- 直感的な理解を助ける  
    未選択の項目がある場合、下記の挙動をする機能を実装しています。
    > 点滅するサークルを表示する、  
    > 「性能を見てみる」ボタンを押せないようにする  

    ユーザーが直感的に状態を把握できるように工夫しました。
</div>
</details>

<details>
<summary>機能面について</summary>
<div>

下記のことを意識しました。

```
- ユーザーの選択にリアクティブに次の選択肢が設定されること
- 親コンポーネントに渡す引数は、オブジェクトとして渡すこと
```

</div>
</details>


<h2>躓いたポイント</h2>

- [fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API) の使い方  
    非同期でデータをとってくる為、子コンポーネントが作られるときに親コンポーネントでデータをまとめて渡すとうまく動作しませんでした。  
    最終的には子コンポーネントで直接データを取得するというシンプルな方法となりましたが、そこに気づくまでに時間がかかってしまいました。

- Vue.js でオブジェクトや配列が参照渡しをされること  
    作成されたコンピュータオブジェクトを$emitで親コンポーネントに渡し、配列に保存しています。次のコンピュータを作成した際に、配列に保存したデータが全て書き換えられてしまう問題が起きました。結果、参照渡しをしていたことが原因でした。[JSON.stringify()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) -> [JSON.parse()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)とすることで解決することができました。

> 時間はかかってしまいましたが、全て自分で調べ解決できたことは良かったと思っています。