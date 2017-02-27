import * as request from "request";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";
import {AuthorizationCodeEntity} from "../domain/auth/AuthorizationCodeEntity";
import {AuthorizationRequest} from "../domain/auth/request/AuthorizationRequest";
import InternalServerError from "../errors/InternalServerError";
import BadRequestError from "../errors/BadRequestError";
import {Logger} from "../infrastructures/Logger";
import {Authlete} from "../config/Authlete";

/**
 * AuthorizationRepository
 *
 * @author keita-nishimoto
 * @since 2017-02-15
 */
export class AuthorizationRepository {

  /**
   * 認可コードを発行する
   *
   * @param authorizationRequest
   * @returns {Promise<AuthorizationCodeEntity>}
   */
  issueAuthorizationCode(authorizationRequest: AuthorizationRequest.Request): Promise<AuthorizationCodeEntity> {
    return new Promise((resolve: Function, reject: Function) => {
      this.issueAuthorizationTicket(authorizationRequest)
        .then((authorizationResponse) => {
          const headers = {
            "Content-Type": "application/json"
          };

          const params = {
            ticket: authorizationResponse.ticket,
            subject: authorizationRequest.subject
          };

          const options = {
            url: "https://api.authlete.com/api/auth/authorization/issue",
            method: "POST",
            auth: {
              username: Authlete.getApiKey(),
              pass: Authlete.getApiSecret()
            },
            json: true,
            headers: headers,
            body: params
          };

          request(options, (error: Error, response: any, authorizationIssueResponse: AuthleteResponse.AuthorizationIssueResponse) => {
            try {
              if (error) {
                Logger.critical(error);
                reject(
                  new InternalServerError(error.message)
                );
              }

              if (response.statusCode !== 200) {
                Logger.critical(response);
                reject(
                  new InternalServerError()
                );
              }

              const action = authorizationIssueResponse.action.toString();

              switch (action) {
                case "LOCATION":
                  const authorizationCodeEntity = new AuthorizationCodeEntity(authorizationIssueResponse);
                  resolve(authorizationCodeEntity);
                  break;
                case "BAD_REQUEST":
                  reject(
                    new BadRequestError(authorizationIssueResponse.resultMessage)
                  );
                  break;
                default:
                  Logger.critical(authorizationIssueResponse);
                  reject(
                    new InternalServerError(authorizationIssueResponse.resultMessage)
                  );
                  break;
              }

            } catch (error) {
              Logger.critical(error);
              reject(
                new InternalServerError(error.message)
              );
            }
          });
        })
        .catch((error: Error) => {
          Logger.critical(error);
          reject(
            new InternalServerError(error.message)
          );
        });
    });
  }

  /**
   * 認可ticketを発行する
   *
   * @param authorizationRequest
   * @returns {Promise<AuthleteResponse.Authorization>}
   */
  private issueAuthorizationTicket(authorizationRequest: AuthorizationRequest.Request): Promise<AuthleteResponse.Authorization> {
    return new Promise((resolve: Function, reject: Function) => {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
      };

      const clientId    = authorizationRequest.clientId;
      const state       = authorizationRequest.state;
      const redirectUri = authorizationRequest.redirectUri;

      let scopes = "openid";
      authorizationRequest.scopes.map((scope) => {
        if (scope !== "openid") {
          scopes += "%20" + scope;
        }
      });

      const options = {
        url: "https://api.authlete.com/api/auth/authorization",
        method: "POST",
        auth: {
          username: Authlete.getApiKey(),
          pass: Authlete.getApiSecret()
        },
        json: true,
        headers: headers,
        form: `parameters=client_id%3D${clientId}%26response_type%3Dcode%26state%3D${state}%26scope%3D${scopes}%26redirect_uri=${redirectUri}`
      };

      request(options, (error: Error, response: any, authorizationResponse: AuthleteResponse.Authorization) => {
        try {
          if (error) {
            Logger.critical(error);
            reject(
              new InternalServerError(error.message)
            );
          }

          if (response.statusCode !== 200) {
            Logger.critical(response);
            reject(
              new InternalServerError()
            );
          }

          const action = authorizationResponse.action.toString();
          switch (action) {
            case "INTERACTION":
              resolve(authorizationResponse);
              break;
            case "BAD_REQUEST":
              reject(
                new BadRequestError(authorizationResponse.resultMessage)
              );
              break;
            case "INTERNAL_SERVER_ERROR":
              Logger.critical(authorizationResponse);
              reject(
                new InternalServerError(authorizationResponse.resultMessage)
              );
              break;
            default:
              reject(
                new InternalServerError(authorizationResponse.resultMessage)
              );
              break;
          }

        } catch (error) {
          Logger.critical(error);
          reject(
            new InternalServerError(error.message)
          );
        }
      });
    });
  }
}
