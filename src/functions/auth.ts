import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import AccessTokenRepository from "../repositories/AccessTokenRepository";
import AccessTokenEntity from "../domain/auth/AccessTokenEntity";
import Statement from "../domain/auth/aws/iam/Statement";
import PolicyDocument from "../domain/auth/aws/iam/PolicyDocument";
import AuthorizationResponse from "../domain/auth/aws/iam/AuthorizeResponse";
import Environment from "../infrastructures/Environment";
import ErrorResponse from "../domain/ErrorResponse";
import UserRepository from "../repositories/UserRepository";
import PasswordService from "../domain/auth/PasswordService";
import UserEntity from "../domain/user/UserEntity";
import UnauthorizedError from "../errors/UnauthorizedError";
import {ResourceRepository} from "../repositories/ResourceRepository";
import {ResourceEntity} from "../domain/resource/ResourceEntity";
import NotFoundError from "../errors/NotFoundError";
import {AuthorizationRepository} from "../repositories/AuthorizationRepository";
import {AuthorizationRequest} from "../domain/auth/request/AuthorizationRequest";

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

sourceMapSupport.install();

/**
 * 認証を行う
 * この関数はAuthlete.Authentication Callbackに合わせて作成されている事が必要
 *
 * @param event
 * @param context
 * @param callback
 * @link https://www.authlete.com/documents/definitive_guide/authentication_callback
 */
export const authentication = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {

  const environment = new Environment(event);

  let requestBody;
  if (environment.isLocal() === true) {
    requestBody = event.body;

    dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
      environment.isLocal()
    );
  } else {
    requestBody = JSON.parse(event.body);
  }

  const userId: string = requestBody.id;
  const password: string = requestBody.password;

  const userRepository = new UserRepository(dynamoDbDocumentClient);
  userRepository.find(userId)
    .then((userEntity: UserEntity) => {

      const requestPassword = PasswordService.generatePasswordHash(password);
      if (userEntity.verifyPassword(requestPassword) === false) {
        throw new UnauthorizedError();
      }

      const responseBody = {
        authenticated: true,
        subject: userId,
        claims: {
          name: userEntity.name,
          email: userEntity.email,
          email_verified: userEntity.emailVerified,
          gender: userEntity.gender,
          birthdate: userEntity.birthdate
        }
      };

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseBody),
      };

      callback(null, response);
    })
    .catch((error: Error) => {
      console.error("authentication", error);

      const errorResponse = new ErrorResponse(error);
      const response = errorResponse.getResponse();

      callback(null, response);
    });
};

/**
 * 認可コードを発行する
 *
 * @param event
 * @param context
 * @param callback
 */
export const issueAuthorizationCode = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {

  const environment = new Environment(event);

  let requestBody;
  if (environment.isLocal() === true) {
    requestBody = event.body;
  } else {
    requestBody = JSON.parse(event.body);
  }

  const clientId    = requestBody.client_id;
  const state       = requestBody.state;
  const redirectUri = requestBody.redirect_uri;
  const subject     = requestBody.subject;
  const scopes      = requestBody.scopes;

  const requestBuilder = new AuthorizationRequest.RequestBuilder();
  requestBuilder.clientId    = clientId;
  requestBuilder.state       = state;
  requestBuilder.redirectUri = redirectUri;
  requestBuilder.subject     = subject;
  requestBuilder.scopes      = scopes;

  const authorizationRequest = requestBuilder.build();

  const authorizationRepository = new AuthorizationRepository();
  authorizationRepository.issueAuthorizationCode(authorizationRequest)
    .then((authorizationCodeEntity) => {

      const responseBody = {
        code: authorizationCodeEntity.code,
        state: authorizationCodeEntity.state
      };

      const response = {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseBody)
      };

      callback(null, response);
    })
    .catch((error: Error) => {
      console.error("issueAuthorizationCode", error);

      const errorResponse = new ErrorResponse(error);
      const response = errorResponse.getResponse();

      callback(null, response);
    });
};

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
      return hasRequiredScopes(event.methodArn, accessTokenEntity);
    })
    .then((accessTokenEntity) => {

      let effect = "";
      switch (accessTokenEntity.extractHttpStats()) {
        case "OK":
          effect = "Allow";
          if (accessTokenEntity.isAllowed === false) {
            effect = "Deny";
          }
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

      const authorizationResponse = generatePolicy(
        accessTokenEntity.introspectionResponse.subject,
        effect,
        [event.methodArn]
      );

      callback(null, authorizationResponse);
    })
    .catch((error) => {
      console.error("authorization", error);
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
 * ARNからscopeを持っているか確認する
 * 結果はAccessTokenEntity.isAllowed にセットされる
 *
 * @param arn
 * @param accessTokenEntity
 * @returns {Promise<AccessTokenEntity>}
 */
const hasRequiredScopes = (arn: string, accessTokenEntity: AccessTokenEntity) => {
  // TODO メソッド名が微妙。一度に複数の事をやっているのもダメ。時間が出来たらリファクタ対象。 @keita-nishimoto
  return new Promise<AccessTokenEntity>((resolve: Function, reject: Function) => {
    const resource = extractMethodAndPath(arn);
    const resourceId = `${resource.httpMethod}/${resource.resourcePath}`;

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);
    resourceRepository
      .find(resourceId)
      .then((resourceEntity: ResourceEntity) => {

        resourceEntity.scopes.map((scopeResourceHas) => {
          accessTokenEntity.introspectionResponse.scopes.map((scopeTokenHas) => {
            if (scopeResourceHas === scopeTokenHas) {
              accessTokenEntity.isAllowed = true;
            }
          });
        });

        resolve(accessTokenEntity);
      })
      .catch((error: Error) => {
        if (error.name === "NotFoundError") {
          accessTokenEntity.isAllowed = true;
          resolve(accessTokenEntity);
        } else {
          reject(error);
        }
      });
  });
};

/**
 * ARNからリソースのHTTPメソッドとリソースパスを取り出す
 *
 * @param arn
 * @returns {{httpMethod: string, resourcePath: string}}
 */
const extractMethodAndPath = (arn: string): {httpMethod: string, resourcePath: string} => {
  const arnElements      = arn.split(":", 6);
  const resourceElements = arnElements[5].split("/", 4);
  const httpMethod       = resourceElements[2];
  const resourcePath     = resourceElements[3];

  return {
    httpMethod: httpMethod,
    resourcePath: resourcePath
  };
};

/**
 * API Gatewayに返すポリシーを生成する
 *
 * @param principalId
 * @param effect
 * @param resource
 * @returns {{principalId: string, policyDocument: {Version: string, Statement: {Action: string, Effect: string, Resource: string[]}[]}}}
 */
const generatePolicy = (principalId: string, effect: string, resource: [string]): Object => {

  const statement = new Statement(
    "execute-api:Invoke",
    effect,
    resource
  );

  const policyDocument = new PolicyDocument(
    "2012-10-17",
    [statement]
  );

  const authorizationResponse = new AuthorizationResponse(
    principalId,
    policyDocument
  );

  return authorizationResponse.toObject();
};
