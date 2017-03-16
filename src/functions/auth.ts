import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaApiGatewayCustomAuthorizerEvent} from "../types/aws/types";
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
import UnauthorizedError from "../errors/UnauthorizedError";
import {ResourceRepository} from "../repositories/ResourceRepository";
import {AuthorizationRepository} from "../repositories/AuthorizationRepository";
import {SuccessResponse} from "../domain/SuccessResponse";
import {Logger} from "../infrastructures/Logger";
import {AuthValidationService} from "../domain/auth/AuthValidationService";
import {ValidationErrorResponse} from "../domain/ValidationErrorResponse";
import {RequestFactory} from "../factories/RequestFactory";
import {AuthleteAPIConstant} from "../types/authlete/AuthleteAPIConstant";
import {AuthRequest} from "../domain/auth/request/AuthRequest";

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

sourceMapSupport.install();

/**
 * 認証を行う
 * この関数はAuthlete.Authentication Callbackに合わせて作成されている事が必要
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 * @link https://www.authlete.com/documents/definitive_guide/authentication_callback
 */
export const authentication = async (
  event: lambda.APIGatewayEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    const environment = new Environment<lambda.APIGatewayEvent>(event);
    const requestFactory = new RequestFactory(event, environment.isLocal());
    const request = requestFactory.create();

    if (environment.isLocal() === true) {
      dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
        environment.isLocal()
      );
    }

    const validateResultObject = AuthValidationService.authenticationValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const userId = request.subject;
    const password = request.password;
    const userRepository = new UserRepository(dynamoDbDocumentClient);

    const userEntity = await userRepository.find(userId);
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

    const successResponse = new SuccessResponse(responseBody);

    callback(undefined, successResponse.getResponse());
  } catch (error) {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  }
};

/**
 * 認可コードを発行する
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 */
export const issueAuthorizationCode = async (
  event: lambda.APIGatewayEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    const environment = new Environment(event);
    const requestFactory = new RequestFactory(event, environment.isLocal());
    const request: AuthRequest.IssueAuthorizationCodeRequest = requestFactory.create();

    const validateResultObject = AuthValidationService.issueAuthorizationCodeValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const authorizationRepository = new AuthorizationRepository();

    const authorizationCodeEntity = await authorizationRepository.issueAuthorizationCode(request);

    const responseBody = {
      code: authorizationCodeEntity.code,
      state: authorizationCodeEntity.state
    };
    const successResponse = new SuccessResponse(responseBody, 201);

    callback(undefined, successResponse.getResponse());
  } catch (error) {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  }
};

/**
 * 認可を行う
 * 一部の例外を除き全てのAPIリクエストはこの関数で認可を行う
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 */
export const authorization = async (
  event: LambdaApiGatewayCustomAuthorizerEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    const authorizationHeader = event.authorizationToken;
    const accessToken = extractAccessToken(authorizationHeader);

    if (accessToken === "") {
      callback(new Error("Unauthorized"));
    }

    const accessTokenEntity = await introspect(accessToken);

    let effect = "";
    switch (accessTokenEntity.extractIntrospectionAction()) {
      case AuthleteAPIConstant.IntrospectionActions.OK:
        const hasScope = await hasRequiredScope(event.methodArn, accessTokenEntity);
        effect = "Allow";
        if (hasScope === false) {
          effect = "Deny";
        }
        break;
      case AuthleteAPIConstant.IntrospectionActions.BAD_REQUEST:
      case AuthleteAPIConstant.IntrospectionActions.FORBIDDEN:
        effect = "Deny";
        break;
      case AuthleteAPIConstant.IntrospectionActions.UNAUTHORIZED:
        callback(new Error("Unauthorized"));
        break;
      case AuthleteAPIConstant.IntrospectionActions.INTERNAL_SERVER_ERROR:
        Logger.critical(accessTokenEntity.introspectionResponse);
        callback(new Error("Internal Server Error"));
        break;
      default:
        Logger.critical(accessTokenEntity.introspectionResponse);
        callback(new Error("Internal Server Error"));
        break;
    }

    let principalId = accessTokenEntity.introspectionResponse.subject;

    // クライアントクレデンシャル等で発行されたアクセストークンはsubjectが設定されない場合がある
    // よってその場合はクライアントIDを文字列型にキャストしてprincipalIdに設定する
    if (principalId == null) {
      principalId = accessTokenEntity.introspectionResponse.clientId.toString();
    }

    const authorizationResponse = generatePolicy(
      principalId,
      effect,
      [event.methodArn]
    );

    callback(undefined, authorizationResponse);
  } catch (error) {
    Logger.critical(error);
    callback(error);
  }
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
const introspect = async (accessToken: string): Promise<AccessTokenEntity> => {
  const accessTokenRepository = new AccessTokenRepository();

  return await accessTokenRepository.fetch(accessToken);
};

/**
 * ARNからscopeを持っているか確認する
 *
 * @param arn
 * @param accessTokenEntity
 * @returns {Promise<boolean>}
 */
const hasRequiredScope = async (
  arn: string,
  accessTokenEntity: AccessTokenEntity
): Promise<boolean> => {
  try {
    const resource = extractMethodAndPath(arn);
    const resourceId = `${resource.httpMethod}/${resource.resourcePath}`;

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);
    const resourceEntity = await resourceRepository.find(resourceId);

    let hasScope = false;
    resourceEntity.scopes.map((scopeResourceHas) => {
      if (hasScope === true) {
        return;
      }

      accessTokenEntity.introspectionResponse.scopes.map((scopeTokenHas) => {
        if (scopeResourceHas === scopeTokenHas) {
          hasScope = true;
          return;
        }
      });
    });

    return hasScope;
  } catch (error) {
    if (error.name === "NotFoundError") {
      return true;
    } else {
      throw error;
    }
  }
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
