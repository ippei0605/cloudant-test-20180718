# Cloudant Test (Published 2018/7/18)

## はじめに
IBM Cloud の Cloudant がリソースグループに対応しました。現在はサービスインスタンス作成時に次の `Available authentication methods` を選択する形になっています。

1. Use both legacy credentials and IAM (*1)
2. Use only IAM

当面は 1. を選択しておけば、既存のアプリを回収する必要はなさそうですが、今後のために 2. の検証をします。

