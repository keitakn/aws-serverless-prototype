import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import Environment from "../infrastructures/Environment";
import AccessTokenRepository from "../repositories/AccessTokenRepository";
import ErrorResponse from "../domain/ErrorResponse";
import {SuccessResponse} from "../domain/SuccessResponse";

sourceMapSupport.install();

/**
 * 認可コードからアクセストークンを発行する
 *
 * @param event
 * @param context
 * @param callback
 * @returns {Promise<void>}
 */
export const issueTokenFromCode = async (
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

    const authorizationCode = requestBody.code;
    const redirectUri       = requestBody.redirect_uri;

    const accessTokenRepository = new AccessTokenRepository();

    const accessTokenEntity = await accessTokenRepository.issue(authorizationCode, redirectUri);

    const successResponse = new SuccessResponse(
      accessTokenEntity.tokenResponse.responseContent,
      201
    );

    callback(undefined, successResponse.getResponse(false));
  } catch (error) {
    const errorResponse = new ErrorResponse(error);
    const response = errorResponse.getResponse();

    callback(undefined, response);
  }
};
