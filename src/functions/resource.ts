import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
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

  await resourceRepository.save(resourceEntity).then((resourceEntity: ResourceEntity) => {
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
  }).catch((error: Error) => {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  });
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
  event: LambdaExecutionEvent,
  context: lambda.Context,
  callback: lambda.Callback
): Promise<void> => {
  const environment = new Environment(event);
  const resourceId = event.pathParameters.id;
  console.log(environment);
  console.log(resourceId);

  const successResponse = new SuccessResponse({}, 204);

  callback(undefined, successResponse.getResponse());
};
