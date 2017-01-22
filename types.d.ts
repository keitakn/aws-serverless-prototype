/**
 * aws-lambdaのeventインターフェース
 *
 * "@types/aws-lambda"から正式な型定義が提供されるまでの仮対応
 *
 * @author keita-nishimoto
 * @since 2016-01-09
 */
export interface LambdaExecutionEvent {
  resource: string;
  path: string;
  httpMethod: string;
  headers: any;
  queryStringParameters: any;
  pathParameters: any;
  stageVariables: any;
  requestContext: {
    accountId: string;
    resourceId: string;
    stage: string;
    requestId: string;
    identity: {
      cognitoIdentityPoolId: string;
      accountId: string;
      cognitoIdentityId: string;
      caller: string;
      apiKey: string;
      sourceIp: string;
      accessKey: any;
      cognitoAuthenticationType: string;
      cognitoAuthenticationProvider: string;
      userArn: string;
      userAgent: string;
      user: string;
    },
    resourcePath: string;
    httpMethod: string;
    apiId: string;
  },
  body: any;
  // methodArn, authorizationTokenはカスタム認可の時だけ設定される
  methodArn: string;
  authorizationToken: string;
  isBase64Encoded: boolean;
}
