import * as lambda from "aws-lambda";
import * as sourceMapSupport from "source-map-support";
import {ClientValidationService} from "../domain/client/ClientValidationService";
import {ClientRequest} from "../domain/client/request/ClientRequest";
import ErrorResponse from "../domain/ErrorResponse";
import {SuccessResponse} from "../domain/SuccessResponse";
import {ValidationErrorResponse} from "../domain/ValidationErrorResponse";
import AuthleteHttpClientFactory from "../factories/AuthleteHttpClientFactory";
import ClientRepository from "../repositories/ClientRepository";

sourceMapSupport.install();

const axiosInstance = AuthleteHttpClientFactory.create();

/**
 * クライアントを1件取得する
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

    const validateResultObject = ClientValidationService.findValidate(request);
    if (Object.keys(validateResultObject).length !== 0) {
      const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
      callback(undefined, validationErrorResponse.getResponse());
      return;
    }

    const clientId = request.client_id;
    const clientRepository = new ClientRepository(axiosInstance);

    const clientEntity = await clientRepository.find(clientId);

    const responseBody = {
      client_id: clientEntity.clientId,
      client_secret: clientEntity.clientSecret,
      client_name: clientEntity.name,
      developer: clientEntity.developer,
      application_type: clientEntity.applicationType,
      redirect_uris: clientEntity.redirectUris,
      grant_types: clientEntity.grantTypes,
      scopes: clientEntity.scopes,
      created_at: clientEntity.createdAt,
      updated_at: clientEntity.updatedAt,
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
 * APIGatewayEventからリクエストパラメータを取り出す
 *
 * @param event
 * @returns {{client_id: number}}
 */
const extractRequest = (event: lambda.APIGatewayEvent): ClientRequest.FindRequest => {
  if (event.pathParameters != null) {
    return {
      client_id: parseInt(event.pathParameters.id, 10),
    };
  }

  return {
    client_id: 0,
  };
};

