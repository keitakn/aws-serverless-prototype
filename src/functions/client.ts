import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import ErrorResponse from "../domain/ErrorResponse";
import ClientRepository from "../repositories/ClientRepository";
import {SuccessResponse} from "../domain/SuccessResponse";
import {ClientValidationService} from "../domain/client/ClientValidationService";
import {ValidationErrorResponse} from "../domain/ValidationErrorResponse";

sourceMapSupport.install();

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
  callback: lambda.Callback
): Promise<void> => {
  try {
    if (event.pathParameters != null) {
      const request = {
        client_id: parseInt(event.pathParameters.id)
      };

      const validateResultObject = ClientValidationService.findValidate(request);
      if (Object.keys(validateResultObject).length !== 0) {
        const validationErrorResponse = new ValidationErrorResponse(validateResultObject);
        callback(undefined, validationErrorResponse.getResponse());
        return;
      }

      const clientId = request.client_id;
      const clientRepository = new ClientRepository();

      const clientEntity = await clientRepository.find(clientId);

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

      const successResponse = new SuccessResponse(responseBody);

      callback(undefined, successResponse.getResponse());
    }
  } catch (error) {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  }
};

