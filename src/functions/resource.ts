import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import {ResourceEntity} from "../domain/resource/ResourceEntity";
import {ResourceRepository} from "../repositories/ResourceRepository";
import Environment from "../infrastructures/Environment";
import ErrorResponse from "../domain/ErrorResponse";
import {SuccessResponse} from "../domain/SuccessResponse";

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

sourceMapSupport.install();

/**
 * リソースを作成する
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 */
export const create = async (
  event: lambda.APIGatewayEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    const environment = new Environment(event);

    let requestBody;
    if (environment.isLocal() === true) {
      requestBody = event.body;
    } else {
      const eventBody: any = event.body;
      requestBody = JSON.parse(eventBody);
    }

    const httpMethod   = requestBody.http_method;
    const resourcePath = requestBody.resource_path;
    const name         = requestBody.name;
    const scopes       = requestBody.scopes;

    const nowDateTime = new Date().getTime();
    const resourceId  = `${httpMethod}/${resourcePath}`;

    const resourceEntity = new ResourceEntity(resourceId, nowDateTime);
    resourceEntity.httpMethod = httpMethod;
    resourceEntity.resourcePath = resourcePath;
    resourceEntity.name = name;
    resourceEntity.scopes = scopes;
    resourceEntity.updatedAt = nowDateTime;

    if (environment.isLocal() === true) {
      dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
        environment.isLocal()
      );
    }
    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);

    await resourceRepository.save(resourceEntity);

    const responseBody = {
      id: resourceEntity.id,
      http_method: resourceEntity.httpMethod,
      resource_path: resourceEntity.resourcePath,
      name: resourceEntity.name,
      scopes: resourceEntity.scopes,
      created_at: resourceEntity.createdAt,
      updated_at: resourceEntity.updatedAt
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
 * リソースを取得する
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 */
export const find = async (
  event: lambda.APIGatewayEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    const environment = new Environment(event);

    const request = extractRequest(event);
    const resourceId = request.resource_id;

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);
    if (environment.isLocal() === true) {
      dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
        environment.isLocal()
      );
    }

    const resourceEntity = await resourceRepository.find(resourceId);
    const responseBody = {
      id: resourceEntity.id,
      http_method: resourceEntity.httpMethod,
      resource_path: resourceEntity.resourcePath,
      name: resourceEntity.name,
      scopes: resourceEntity.scopes,
      created_at: resourceEntity.createdAt,
      updated_at: resourceEntity.updatedAt
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
 * リソースを削除する
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 */
export const destroy = async (
  event: lambda.APIGatewayEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  try {
    const environment = new Environment(event);
    const request = extractRequest(event);
    const resourceId = request.resource_id;

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);
    if (environment.isLocal() === true) {
      dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
        environment.isLocal()
      );
    }

    await resourceRepository.destroy(resourceId);

    const successResponse = new SuccessResponse({}, 204);

    callback(undefined, successResponse.getResponse());
  } catch (error) {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  }
};

/**
 * APIGatewayEventからリクエストパラメータを取り出す
 *
 * @param event
 * @returns {any}
 */
const extractRequest = (event: lambda.APIGatewayEvent): ResourceRequest.FindRequest => {
  if (event.pathParameters != null) {
    return {
      resource_id: event.pathParameters.id.replace("_", "/")
    };
  }

  return {
    resource_id: ""
  };
};
