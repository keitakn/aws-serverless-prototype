import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import * as uuid from "uuid";
import {LambdaExecutionEvent} from "../../types";
import ClientEntity from "../domain/client/client-entity";
import ClientRepository from "../repositories/client-repository";
import ErrorResponse from "../domain/error-response";

sourceMapSupport.install();

/**
 * クライアントを作成する
 *
 * @param event
 * @param context
 * @param callback
 */
export const create = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  const requestBody = JSON.parse(event.body);
  const nowDateTime = new Date().getTime();

  const clientEntity = new ClientEntity(uuid.v1(), nowDateTime);

  clientEntity.secret = uuid.v4();
  clientEntity.name = requestBody.name;
  clientEntity.redirectUri = requestBody.redirect_uri;
  clientEntity.updatedAt = nowDateTime;

  const clientRepository = new ClientRepository();

  clientRepository.save(clientEntity)
    .then((clientEntity) => {
      const responseBody = {
        id: clientEntity.id,
        secret: clientEntity.secret,
        name: clientEntity.name,
        redirect_uri: clientEntity.redirectUri,
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
    }).catch((error) => {
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

  const clientId = event.pathParameters.id;
  const clientRepository = new ClientRepository();

  clientRepository.find(clientId)
    .then((clientEntity) => {

      const responseBody = {
        id: clientEntity.id,
        secret: clientEntity.secret,
        name: clientEntity.name,
        redirect_uri: clientEntity.redirectUri,
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

