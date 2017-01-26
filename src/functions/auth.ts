import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import AccessTokenRepository from "../repositories/access-token-repository";
import AccessTokenEntity from "../domain/auth/access-token-entity";

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
  const authorizationHeader = event.authorizationToken;
  const accessToken = extractAccessToken(authorizationHeader);

  if (accessToken === "") {
    callback(new Error("Unauthorized"));
  }

  introspect(accessToken)
    .then((accessTokenEntity: AccessTokenEntity) => {

      let effect = "";
      switch (accessTokenEntity.extractHttpStats()) {
        case "OK":
          effect = "Allow";
          break;
        case "BAD_REQUEST":
        case "FORBIDDEN":
          effect = "Deny";
          break;
        case "UNAUTHORIZED":
          callback(new Error("Unauthorized"));
          break;
        case "INTERNAL_SERVER_ERROR":
          callback(new Error("Internal Server Error"));
          break;
        default:
          callback(new Error("Internal Server Error"));
          break;
      }

      const authResponse = generatePolicy(
        accessTokenEntity.introspectionResponse.subject,
        effect,
        event.methodArn
      );

      callback(null, authResponse);
    })
    .catch((error) => {
      callback(error);
    });
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
 * AuthleteのイントロスペクションAPIからアクセストークンを取得する
 *
 * @param accessToken
 * @returns {Promise<AccessTokenEntity>}
 */
const introspect = (accessToken: string): Promise<AccessTokenEntity> => {
  const accessTokenRepository = new AccessTokenRepository();

  return accessTokenRepository.fetch(accessToken);
};

/**
 * API Gatewayに返すポリシーを生成する
 *
 * @param principalId
 * @param effect
 * @param resource
 * @returns {{principalId: string, policyDocument: {}}}
 */
const generatePolicy = (principalId: string, effect: string, resource: any): any => {
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
