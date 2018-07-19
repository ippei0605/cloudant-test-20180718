# Cloudant Test (Published 2018/7/18)

## はじめに
IBM Cloud の Cloudant がリソースグループに対応しました。現在はサービスインスタンス作成時に次の `Available authentication methods` を選択する形になっています。

1. Use both legacy credentials and IAM
2. Use only IAM

新たにサービスインスタンスを作成する場合でも、当面は 1. を選択しておけば、既存のアプリを回収する必要はなさそうですが、今後のために IAM 認証による操作方法を検証をします。

## 環境構築および実行
商用では基本コードベースだと思いますのでコマンドで設定します。適宜ご自身の環境に読み換えて実行してください。

1. [package.json](package.json) の `config` をご自身の環境に合わせて変更してください。

    | Property            | Default value                    | Description |
    |:--------------------|:---------------------------------|:------------|
    | api_endpoint        | https://api.ng.bluemix.net       | IBM Cloud のエンドポイント (米国南部) |
    | app_name            | cloudant-test-20180718-ippei0605 | アプリ名 (米国南部でユニークなので変更してください) |
    | cloudant_name       | cloudant-ippei0605               | Cloudant のインスタンス名 (変更しなくても大丈夫です) |
    | cloudant_alias_name | cloudant-ippei0605-alias         | Cloudant のエイリアス名 (変更しなくても大丈夫です) |
    | db_name             | alice                            | 作成するデータベース名 (変更しなくても大丈夫です) |
    | doc_name            | rabbit                           | 登録する文書名 (変更しなくても大丈夫です) |

1. [manifest.yml](server/manifest.yml) をご自身の環境に合わせて変更してください。

    | Property   | Default value                    | Description |
    |:-----------|:---------------------------------|:------------|
    | host       | cloudant-test-20180718-ippei0605 | ホスト名     |
    | name       | cloudant-test-20180718-ippei0605 | アプリ名     |
    | domain     | mybluemix.net                    | 米国南部     |
    | services   | cloudant-ippei0605-alias         | バインドするサービスインスタンス名 |

    > package.json で設定した値に合わせてください。

1. IBM Cloud にログインしてください。
  ```
  $ npm run login
  ```
  > 上記コマンドで e-mail, パスワードの入力、アカウント、組織、スペースの選択ができるはずです。
  > 上手くいかない場合は直接 ibmcloud コマンドでログインしてください。

1. サービスインスタンスをエイリアスを作成してください。
  ```
  npm run service_create
  ```

1. アプリをプッシュしてください。
  ```
  $ npm run push
  ```
  > `postinstall` でデータベースの削除、作成、文書登録が実行されます。

1. アプリを実行してください。
  ```
  $ npm run page
  ```
  > 登録した文書が表示されます。

## まとめ
* サービスインスタンスの作成
  - Dashboard だと `Available authentication methods` を選択できますが、ibmcloud コマンドではパラメータが公開されていません。次のコマンドでサービスインスタンスを作成すると、`Use both legacy credentials and IAM` になっているようです。(サービス資格情報に password が付いているため。)

    ```
    $ ibmcloud resource service-instance-create cloudant-ippei0605 cloudant lite us-south
    ```

* サービスインスタンスのエイリアス
  - Dashboard だとアプリから直接接続するサービス (リソースグループ) を指定できますが、コマンドや manifest.yml でバインドする場合は、Cloudfoundry Service に エイリアスを作成する必要があります。

    ```
    $ ibmcloud resource service-alias-create cloudant-ippei0605-alias --instance-name cloudant-ippei0605
    ```

* Node.js における Cloudant インスタンスの作成例

  ```javascript
  const cloudant = new Cloudant({
      url: context.cloudantCreds.url,
      maxAttempt: 5,
      plugins: [
          'promises',
          {
              iamauth: {
                  iamApiKey: context.cloudantCreds.iam_apikey_name
              }
          },
          {
              retry: {
                  retryDelayMultiplier: 4
              }
          }
      ]
  });
  ```