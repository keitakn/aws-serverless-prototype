import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import {ResourceEntity} from "../domain/resource/ResourceEntity";

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

  const requestBody  = JSON.parse(event.body);
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
};
