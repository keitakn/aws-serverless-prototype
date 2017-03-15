import axios from "axios";
import {AxiosResponse} from "axios";
import {AuthorizationCodeEntity} from "../domain/auth/AuthorizationCodeEntity";
import {AuthorizationRequest} from "../domain/auth/request/AuthorizationRequest";
import InternalServerError from "../errors/InternalServerError";
import BadRequestError from "../errors/BadRequestError";
import {Logger} from "../infrastructures/Logger";
import {Authlete} from "../config/Authlete";
import {AuthorizationRepositoryInterface} from "../domain/auth/AuthorizationRepositoryInterface";
import {AuthleteAPI} from "../types/authlete/types";
import {AuthleteAPIConstant} from "../types/authlete/AuthleteAPIConstant";

/**
 * AuthorizationRepository
 *
 * @author keita-nishimoto
 * @since 2017-02-15
 */
export class AuthorizationRepository implements AuthorizationRepositoryInterface {

  /**
   * 認可コードを発行する
   *
   * @param authorizationRequest
   * @returns {Promise<AuthorizationCodeEntity>}
   */
  async issueAuthorizationCode(authorizationRequest: AuthorizationRequest.Request): Promise<AuthorizationCodeEntity> {
    try {
      const authorizationResponse = await this.issueAuthorizationTicket(authorizationRequest);

      const headers = {
        "Content-Type": "application/json"
      };

      const requestData = {
        ticket: authorizationResponse.ticket,
        subject: authorizationRequest.subject
      };

      const requestConfig = {
        headers: headers,
        auth: {
          username: Authlete.getApiKey(),
          password: Authlete.getApiSecret()
        }
      };

      const response: AxiosResponse = await axios.post(
        "https://api.authlete.com/api/auth/authorization/issue",
        requestData,
        requestConfig
      );

      if (response.status !== 200) {
        Logger.critical(response);
        return Promise.reject(
          new InternalServerError()
        );
      }

      const authorizationIssueResponse: AuthleteAPI.AuthorizationIssueResponse = response.data;
      const action = authorizationIssueResponse.action.toString();

      switch (action) {
        case AuthleteAPIConstant.AuthorizationIssueActions.LOCATION:
          return new AuthorizationCodeEntity(authorizationIssueResponse);
        case AuthleteAPIConstant.AuthorizationIssueActions.BAD_REQUEST:
          return Promise.reject(
            new BadRequestError(authorizationIssueResponse.resultMessage)
          );
        default:
          Logger.critical(authorizationIssueResponse);
          return Promise.reject(
            new InternalServerError(authorizationIssueResponse.resultMessage)
          );
      }
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(error);
    }
  }

  /**
   * 認可ticketを発行する
   *
   * @param authorizationRequest
   * @returns {Promise<AuthleteAPI.Authorization>}
   */
  private async issueAuthorizationTicket(authorizationRequest: AuthorizationRequest.Request): Promise<AuthleteAPI.AuthorizationResponse> {
    try {
      const headers = {
        "Content-Type": "application/json"
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

      const requestData = {
        parameters: `client_id=${clientId}&response_type=code&state=${state}&scope=${scopes}&redirect_uri=${redirectUri}`
      };

      const requestConfig = {
        headers: headers,
        auth: {
          username: Authlete.getApiKey(),
          password: Authlete.getApiSecret()
        }
      };

      const response: AxiosResponse = await axios.post(
        "https://api.authlete.com/api/auth/authorization",
        requestData,
        requestConfig
      );

      if (response.status !== 200) {
        Logger.critical(response);
        return Promise.reject(
          new InternalServerError()
        );
      }

      const authorizationResponse: AuthleteAPI.AuthorizationResponse = response.data;
      const action = authorizationResponse.action.toString();
      switch (action) {
        case AuthleteAPIConstant.AuthorizationActions.INTERACTION:
          return authorizationResponse;
        case AuthleteAPIConstant.AuthorizationActions.BAD_REQUEST:
          return Promise.reject(
            new BadRequestError(authorizationResponse.resultMessage)
          );
        case AuthleteAPIConstant.AuthorizationActions.INTERNAL_SERVER_ERROR:
          Logger.critical(authorizationResponse);
          return Promise.reject(
            new InternalServerError(authorizationResponse.resultMessage)
          );
        default:
          Logger.critical(authorizationResponse);
          return Promise.reject(
            new InternalServerError(authorizationResponse.resultMessage)
          );
      }
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(error);
    }
  }
}
