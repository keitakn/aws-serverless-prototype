import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import {ResourceEntity} from "../domain/resource/ResourceEntity";
import {ResourceRepository} from "../repositories/ResourceRepository";
import Environment from "../infrastructures/Environment";
import ErrorResponse from "../domain/ErrorResponse";

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

sourceMapSupport.install();

/**
 * リソースを作成する
 *
 * @param event
 * @param context
 * @param callback
 */
export const create = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {

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

  resourceRepository.save(resourceEntity)
    .then((resourceEntity: ResourceEntity) => {

      const responseBody = {
        id: resourceEntity.id,
        http_method: resourceEntity.httpMethod,
        resource_path: resourceEntity.resourcePath,
        name: resourceEntity.name,
        scopes: resourceEntity.scopes,
        created_at: resourceEntity.createdAt,
        updated_at: resourceEntity.updatedAt
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
      const errorResponse = new ErrorResponse(error);
      const response = errorResponse.getResponse();

      callback(null, response);
    });
};
