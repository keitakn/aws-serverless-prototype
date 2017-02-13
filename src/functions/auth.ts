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

  // TODO これは仮実装、準備が整い次第本格的な実装を行う。 @keita-koga
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

      fetchRequiredScopes(event.methodArn);

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
 * ARNから必要となるscopeのリストを返す
 *
 * @param arn
 * @returns {string}
 */
const fetchRequiredScopes = (arn: string): string => {
  // TODO 仮実装です。 @keita-nishimoto
  const resource = extractMethodAndPath(arn);

  return resource.httpMethod + resource.resourcePath;
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
