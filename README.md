# aws-serverless-prototype
Serverless Frameworkを使ったAWS Lambdaプロジェクトの試作品

## 事前準備

### 管理用のIAMユーザーを作成する
serverlessの管理を行う為のIAMユーザーの作成が必要です。

[公式ドキュメント](https://serverless.com/framework/docs/providers/aws/guide/credentials/) に載っているように「AdministratorAccess」権限を持つユーザーを作成しておきます。

次にAccess key IDとSecret access keyをcredentialとして登録します。

[github](https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md) に載っているようにコマンドを使う方法が簡単です。

```bash
serverless config credentials --provider aws --key <your-key-here> --secret <your-secret-key-here>
```

### Authleteのアカウントを作成する
[Authlete](https://www.authlete.com) はOAuth2.0 サーバーとOpenIDConnectプロバイダーをクラウド上で構築出来るサービスです。

本システムでは[AmazonAPIGateway Custom Authorization](http://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/use-custom-authorizer.html) を利用して[Authlete](https://www.authlete.com) のアクセストークンでAPIリソースを保護しています。

つまりAPIの呼び出しには [Authlete](https://www.authlete.com) のアクセストークンが必須になります。

### AuthleteのAPIキーとAPIシークレットを入手する

[サービス管理者コンソール](https://so.authlete.com/accounts/login?locale=ja) にログインを行い確認して下さい。

確認した値は控えておき、下記のファイル内に記載します。

- src/repositories/access-token-repository.ts

```
const API_KEY    = "YOUR API KEY";
const API_SECRET = "YOUR API SECRET";
```

この仕組はイケてないので [こちらのissue](https://github.com/keita-nishimoto/aws-serverless-prototype/issues/37) で何らかの対応を行います。

### Authleteのアクセストークン発行方法

Authleteでは、```https://api.authlete.com/api/auth/authorization/direct/{service-api-key}``` というURLで認可エンドポイントのデフォルト実装を提供しています (デフォルトで利用可能になっています)。

最も簡単な方法は以下のURLにブラウザでアクセスして[インプシリットフロー](https://tools.ietf.org/html/rfc6749#section-4.2) でアクセストークンを取得する事です。

下記が接続の例になります。

```
https://api.authlete.com/api/auth/authorization/direct/{service-api-key}?client_id={client-id}&response_type=token
```

表示される認可画面のログインフォームには、あなたのAPIキーとAPIシークレットを入力して下さい。

アクセストークン取得方法のさらに詳しい方法に関しては [Getting Started](https://www.authlete.com/documents/getting_started) を見て下さい。

## How to use

サンプル用の各APIの呼び出し方法です。

各APIの呼出にはアクセストークンによる認可が必要です。
AuthorizationHeaderにアクセストークンを設定して下さい。

以下はcurlでの接続例です。
"YOUR ACCESS TOKEN"の部分をあなたが取得したアクセストークンに置き換えて下さい。

### createClient

```bash
curl -X POST -kv \
-H "Authorization: Bearer YOUR ACCESS TOKEN" \
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
-H "Authorization: Bearer YOUR ACCESS TOKEN" \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/clients/{id}
```

### userCreate

```bash
curl -X POST -kv \
-H "Authorization: Bearer YOUR ACCESS TOKEN" \
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
-H "Authorization: Bearer YOUR ACCESS TOKEN" \
https://XXXX.execute-api.ap-northeast-1.amazonaws.com/dev/users/{id}
```

## AWS services used

- Lambda
- API Gateway
- DynamoDB

## Other services used

- [Authlete](https://www.authlete.com)
