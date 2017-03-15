/**
 * aws-lambdaのeventインターフェース
 *
 * @author keita-nishimoto
 * @since 2016-03-11
 */
export interface LambdaEvent {
  body: string | null;
  headers: {[name: string]: string};
}

/**
 * Amazon API Gateway Custom Authorizers.eventのインターフェース
 *
 * @author keita-nishimoto
 * @since 2016-03-13
 */
export interface LambdaApiGatewayCustomAuthorizerEvent {
  type: string;
  authorizationToken: string;
  methodArn: string;
}
