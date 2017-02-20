import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import ClientEntity from "../domain/client/ClientEntity";
import ErrorResponse from "../domain/ErrorResponse";
import Environment from "../infrastructures/Environment";
import AwsSdkFactory from "../factories/AwsSdkFactory";
import ClientRepository from "../repositories/ClientRepository";
import {ClientRequest} from "../domain/client/ClientRequest";

let dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient();

sourceMapSupport.install();

/**
 * クライアントを作成する
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

  const developer       = requestBody.developer;
  const applicationType = requestBody.application_type;
  const clientType      = requestBody.client_type;
  const redirectUris    = requestBody.redirect_uris;
  const responseTypes   = requestBody.response_types;
  const grantTypes      = requestBody.grant_types;
  const scopes          = requestBody.scopes;

  if (environment.isLocal() === true) {
    dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
      environment.isLocal()
    );
  }
  const clientRepository = new ClientRepository(dynamoDbDocumentClient);

  // TODO オブジェクトの生成方法が冗長なので対策を考え実施する。 @keita-koga
  const createClientRequest = new ClientRequest.CreateClientRequest(
    developer,
    applicationType,
    clientType,
    redirectUris,
    responseTypes,
    grantTypes,
    scopes
  );

  clientRepository.create(createClientRequest)
    .then((clientEntity) => {
      const responseBody = {
        client_id: clientEntity.id,
        client_secret: clientEntity.secret,
        client_name: clientEntity.name,
        developer: clientEntity.developer,
        application_type: clientEntity.applicationType,
        redirect_uris: clientEntity.redirectUris,
        grant_types: clientEntity.grantTypes,
        created_at: clientEntity.createdAt,
        updated_at: clientEntity.updatedAt
      };

      const response = {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseBody),
      };

      callback(null, response);
    })
    .catch((error) => {
      console.error("createClientError", error);
      callback(error);
  });
};

/**
 * クライアントを1件取得する
 *
 * @param event
 * @param context
 * @param callback
 */
export const find = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  // TODO このあたりの処理はリクエストオブジェクトに集約する @keita-nishimoto
  const environment = new Environment(event);
  const clientId = parseInt(event.pathParameters.id);

  if (environment.isLocal() === true) {
    dynamoDbDocumentClient = AwsSdkFactory.getInstance().createDynamoDbDocumentClient(
      environment.isLocal()
    );
  }
  const clientRepository = new ClientRepository(dynamoDbDocumentClient);

  clientRepository.find(clientId)
    .then((clientEntity) => {

      const responseBody = {
        id: clientEntity.id,
        created_at: clientEntity.createdAt,
        updated_at: clientEntity.updatedAt
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
    .catch((error) => {
      // TODO ログにStackTraceを出力させる対応が必要 @keita-nishimoto
      console.error("findClient", error);

      const errorResponse = new ErrorResponse(error);
      const response = errorResponse.getResponse();

      callback(null, response);
    });
};

