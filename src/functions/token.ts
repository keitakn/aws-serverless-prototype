import * as sourceMapSupport from "source-map-support";
import * as lambda from "aws-lambda";
import {LambdaExecutionEvent} from "../../types";
import Environment from "../infrastructures/Environment";
import AccessTokenRepository from "../repositories/AccessTokenRepository";
import ErrorResponse from "../domain/ErrorResponse";

sourceMapSupport.install();

/**
 * 認可コードからアクセストークンを発行する
 *
 * @param event
 * @param context
 * @param callback
 */
export const issueTokenFromCode = (event: LambdaExecutionEvent, context: lambda.Context, callback: lambda.Callback): void => {

  const environment = new Environment(event);

  let requestBody;
  if (environment.isLocal() === true) {
    requestBody = event.body;
  } else {
    requestBody = JSON.parse(event.body);
  }

  const authorizationCode = requestBody.code;
  const redirectUri       = requestBody.redirect_uri;

  const accessTokenRepository = new AccessTokenRepository();
  accessTokenRepository.issue(authorizationCode, redirectUri)
    .then((accessTokenEntity) => {

      const response = {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin" : "*"
        },
        body: accessTokenEntity.tokenResponse.responseContent
      };

      callback(null, response);
    })
    .catch((error: Error) => {
      const errorResponse = new ErrorResponse(error);
      const response = errorResponse.getResponse();

      callback(null, response);
    });
};
