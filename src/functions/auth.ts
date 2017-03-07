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
import UnauthorizedError from "../errors/UnauthorizedError";
import {ResourceRepository} from "../repositories/ResourceRepository";
import {AuthorizationRepository} from "../repositories/AuthorizationRepository";
import {AuthorizationRequest} from "../domain/auth/request/AuthorizationRequest";
import {SuccessResponse} from "../domain/SuccessResponse";
import {Logger} from "../infrastructures/Logger";
import {DomainValidator} from "../domain/DomainValidator";

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
  event: LambdaExecutionEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {

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

  try {
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
  event: LambdaExecutionEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {

  const environment = new Environment(event);

  let requestBody;
  if (environment.isLocal() === true) {
    requestBody = event.body;
  } else {
    requestBody = JSON.parse(event.body);
  }

  // TODO 後でJSONSchemeを定義する場所を考える
  const scheme = {
    type: "object",
    required: [
      "client_id",
      "state",
      "redirect_uri",
      "subject",
      "scopes"
    ],
    properties: {
      client_id: {
        "type": "number",
        "minimum": 1,
        "maximum": 9999999999999,
        "exclusiveMaximum": true
      },
      state: {
        "type": "string",
        "minLength": 8,
        "maxLength": 64
      },
      redirect_uri: {
        "type": "string",
        "format": "uri"
      },
      subject: {
        "type": "string",
        "minLength": 36,
        "maxLength": 36
      },
      scopes: {
        "type": "array",
        "items": {
          "type": "string",
          "minLength": 5,
          "maxLength": 32
        }
      }
    },
    additionalProperties: false
  };

  const domainValidator = new DomainValidator(scheme);
  const validatorResult = domainValidator.doValidate(requestBody);
  if (validatorResult.errors.length !== 0) {
    const responseBody = {
      code: 422,
      message: "Unprocessable Entity",
      errors: validatorResult.errors
    };

    const response = {
      statusCode: this.statusCode,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(responseBody)
    };

    callback(undefined, response);
    return;
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

  try {
    const authorizationCodeEntity = await authorizationRepository.issueAuthorizationCode(authorizationRequest);

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
  event: LambdaExecutionEvent,
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

    await hasRequiredScopes(event.methodArn, accessTokenEntity);

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
        Logger.critical(accessTokenEntity.introspectionResponse);
        callback(new Error("Internal Server Error"));
        break;
      default:
        Logger.critical(accessTokenEntity.introspectionResponse);
        callback(new Error("Internal Server Error"));
        break;
    }

    const authorizationResponse = generatePolicy(
      accessTokenEntity.introspectionResponse.subject,
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
 * 結果はAccessTokenEntity.isAllowed にセットされる
 *
 * @param arn
 * @param accessTokenEntity
 * @returns {Promise<AccessTokenEntity>}
 */
const hasRequiredScopes = async (
  arn: string,
  accessTokenEntity: AccessTokenEntity
): Promise<AccessTokenEntity> => {
  try {
    const resource = extractMethodAndPath(arn);
    const resourceId = `${resource.httpMethod}/${resource.resourcePath}`;

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);
    const resourceEntity = await resourceRepository.find(resourceId);

    resourceEntity.scopes.map((scopeResourceHas) => {
      accessTokenEntity.introspectionResponse.scopes.map((scopeTokenHas) => {
        if (scopeResourceHas === scopeTokenHas) {
          accessTokenEntity.isAllowed = true;
          return accessTokenEntity;
        }
      });
    });

    return accessTokenEntity;
  } catch (error) {
    if (error.name === "NotFoundError") {
      accessTokenEntity.isAllowed = true;
      return accessTokenEntity;
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
