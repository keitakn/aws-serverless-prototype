import * as lambda from "aws-lambda";
import * as sourceMapSupport from "source-map-support";
import ErrorResponse from "../domain/ErrorResponse";
import {ResourceRequest} from "../domain/resource/request/ResourceRequest";
import {ResourceEntity} from "../domain/resource/ResourceEntity";
import {ResourceValidationService} from "../domain/resource/ResourceValidationService";
import {SuccessResponse} from "../domain/SuccessResponse";
import {ValidationErrorResponse} from "../domain/ValidationErrorResponse";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import {RequestFactory} from "../factories/RequestFactory";
import {ResourceRepository} from "../repositories/ResourceRepository";

sourceMapSupport.install();

const dynamoDbDocumentClient = AwsSdkFactory.createDynamoDbDocumentClient();

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
  callback: lambda.Callback,
): Promise<void> => {
  try {
    const requestFactory = new RequestFactory(event);
    const request: ResourceRequest.CreateRequest = requestFactory.create();

    const validateResultObject = ResourceValidationService.createValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const httpMethod   = request.http_method;
    const resourcePath = request.resource_path;
    const name         = request.name;
    const scopes       = request.scopes;

    const nowDateTime = new Date().getTime();
    const resourceId  = `${httpMethod}/${resourcePath}`;

    const builder = new ResourceEntity.Builder();
    builder.resourceId = resourceId;
    builder.httpMethod = httpMethod;
    builder.resourcePath = resourcePath;
    builder.name = name;
    builder.scopes = scopes;
    builder.createdAt = nowDateTime;
    builder.updatedAt = nowDateTime;

    const resourceEntity = builder.build();

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);

    await resourceRepository.save(resourceEntity);

    const responseBody = {
      resource_id: resourceEntity.resourceId,
      http_method: resourceEntity.httpMethod,
      resource_path: resourceEntity.resourcePath,
      name: resourceEntity.name,
      scopes: resourceEntity.scopes,
      created_at: resourceEntity.createdAt,
      updated_at: resourceEntity.updatedAt,
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
  callback: lambda.Callback,
): Promise<void> => {
  try {
    const request = extractRequest(event);
    const validateResultObject = ResourceValidationService.findValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const resourceId = request.resource_id.replace(".", "/");

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);

    const resourceEntity = await resourceRepository.find(resourceId);
    const responseBody = {
      resource_id: resourceEntity.resourceId,
      http_method: resourceEntity.httpMethod,
      resource_path: resourceEntity.resourcePath,
      name: resourceEntity.name,
      scopes: resourceEntity.scopes,
      created_at: resourceEntity.createdAt,
      updated_at: resourceEntity.updatedAt,
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
  callback: lambda.Callback,
): Promise<void> => {
  try {
    const request = extractRequest(event);
    const validateResultObject = ResourceValidationService.destroyValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const resourceId = request.resource_id.replace(".", "/");

    const resourceRepository = new ResourceRepository(dynamoDbDocumentClient);

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
      resource_id: event.pathParameters.id,
    };
  }

  return {
    resource_id: "",
  };
};
