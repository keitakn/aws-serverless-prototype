import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";

sourceMapSupport.install();

/**
 * 認可を行う
 * 一部の例外を除き全てのAPIリクエストはこの関数で認可を行う
 *
 * @param event
 * @param context
 * @param callback
 */
export const authorization = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {

  // TODO ロジックは後で適切な形で分離する @keita-nishimoto
  const authorizationHeader = event.headers.Authorization;
  const accessToken = extractAccessToken(authorizationHeader);

  if (accessToken === "") {
    const responseBody = {
      "code": 400,
      "message": "Bad Request"
    };

    const response = {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(responseBody),
    };

    callback(null, response);
  }

  // TODO 第三引数には本来event.methodArnの値を設定する。本実装の時に対応。 @keita-nishimoto
  const authResponse = generatePolicy(
    accessToken,
    "Allow",
    "arn:aws:execute-api:ap-northeast-1:999999999999:test999999/*/POST/clients"
  );

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*"
    },
    body: JSON.stringify(authResponse),
  };

  callback(null, response);
};

/**
 * AuthorizationHeaderからアクセストークンを取り出す
 *
 * @param authorizationHeader
 * @returns {string}
 */
const extractAccessToken = (authorizationHeader: string): string => {

  if (authorizationHeader == null) {
    return "";
  }

  const BEARER_TOKEN_PATTERN = /^Bearer[ ]+([^ ]+)[ ]*$/i;

  const result = BEARER_TOKEN_PATTERN.exec(authorizationHeader);

  if (result === null) {
    return "";
  }

  const accessToken = result[1];

  return accessToken;
};

/**
 * API Gatewayに返すポリシーを生成する
 *
 * @param principalId
 * @param effect
 * @param resource
 * @returns {{principalId: string, policyDocument: {}}}
 */
const generatePolicy = (principalId, effect, resource): any => {
  const authResponse = {
    principalId: "",
    policyDocument: {}
  };
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: []
    };

    const statementOne = {
      Action: "execute-api:Invoke",
      Effect: "",
      Resource: ""
    };

    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};
