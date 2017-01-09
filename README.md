# aws-serverless-prototype
Serverless Frameworkを使ったAWS Lambdaプロジェクトの試作品

## 事前準備

serverlessの管理を行う為のIAMユーザーの作成が必要です。

[公式ドキュメント](https://serverless.com/framework/docs/providers/aws/guide/credentials/) に載っているように「AdministratorAccess」権限を持つユーザーを作成しておきます。

次にAccess key IDとSecret access keyをcredentialとして登録します。

[github](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md) に載っているようにコマンドを使う方法が簡単です。

```bash
serverless config credentials --provider aws --key <your-key-here> --secret <your-secret-key-here>
```

### createClient

```bash
curl -X POST -kv \
-d \
'
{
  "body": {
    "name":"neko",
    "redirectUri":"https://example.com"
  }
}
' \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients
```

### findClient

```bash
curl -kv https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients/<id>
```

### userCreate

```bash
curl -X POST -kv \
-d \
'
{
  "email":"keita@gmail.com",
  "name": "keita",
  "gender": "male",
  "birthdate": "1990-01-01"
}
' \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/users
```

## AWS services used

- Lambda
- API Gateway
- DynamoDB
