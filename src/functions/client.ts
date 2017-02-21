import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import ErrorResponse from "../domain/ErrorResponse";
import ClientRepository from "../repositories/ClientRepository";

sourceMapSupport.install();

/**
 * クライアントを1件取得する
 *
 * @param event
 * @param context
 * @param callback
 */
export const find = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {
  const clientId = parseInt(event.pathParameters.id);
  const clientRepository = new ClientRepository();

  clientRepository.find(clientId)
    .then((clientEntity) => {

      const responseBody = {
        client_id: clientEntity.id,
        client_secret: clientEntity.secret,
        client_name: clientEntity.name,
        developer: clientEntity.developer,
        application_type: clientEntity.applicationType,
        redirect_uris: clientEntity.redirectUris,
        grant_types: clientEntity.grantTypes,
        scopes: clientEntity.scopes,
        created_at: clientEntity.createdAt,
        updated_at: clientEntity.updatedAt
      };

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: JSON.stringify(responseBody)
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

