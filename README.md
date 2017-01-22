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

## How to use

サンプル用の各APIの呼び出し方法です。

各APIの呼出にはアクセストークンによる認可が必要です。
Authorizationにアクセストークンを設定して下さい。

- allow（正常に認可が行われる）

```bash
curl -kv \
-H "Authorization: Bearer allow" \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients/{id}
```

- deny（response 403 Forbidden）

```bash
curl -kv \
-H "Authorization: Bearer deny" \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients/{id}
```

- error（500 Internal Server Error）

```bash
curl -kv \
-H "Authorization: Bearer error" \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients/{id}
```

### createClient

```bash
curl -X POST -kv \
-H "Authorization: Bearer allow" \
-d \
'
{
  "name":"neko",
  "redirect_uri":"https://example.com"
}
' \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients
```

### findClient

```bash
curl -kv \
-H "Authorization: Bearer allow" \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients/{id}
```

### userCreate

```bash
curl -X POST -kv \
-H "Authorization: Bearer allow" \
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

### findUser
```bash
curl -kv \
-H "Authorization: Bearer allow" \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/users/{id}
```

## AWS services used

- Lambda
- API Gateway
- DynamoDB
