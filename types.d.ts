/**
 * aws-lambdaのeventインターフェース
 *
 * "@types/aws-lambda"から正式な型定義が提供されるまでの仮対応
 *
 * @author keita-nishimoto
 * @since 2016-01-09
 */
export interface LambdaExecutionEvent {
  resource: string,
  path: string,
  httpMethod: string,
  headers: any,
  queryStringParameters: any,
  pathParameters: any,
  stageVariables: any,
  requestContext: {
    accountId: string,
    resourceId: string,
    stage: string,
    requestId: string,
    identity: {
      cognitoIdentityPoolId: string,
      accountId: string,
      cognitoIdentityId: string,
      caller: string,
      apiKey: string,
      sourceIp: string,
      accessKey: null,
      cognitoAuthenticationType: string,
      cognitoAuthenticationProvider: string,
      userArn: string,
      userAgent: string,
      user: string
    },
    resourcePath: string,
    httpMethod: string,
    apiId: string
  },
  body: any,
  // TODO methodArnは特定の条件下でのみ設定されるようなので設定条件を調査し修正する
  methodArn: string,
  isBase64Encoded: boolean
}
