import axios from "axios";
import {AxiosResponse} from "axios";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";
import {AuthorizationCodeEntity} from "../domain/auth/AuthorizationCodeEntity";
import {AuthorizationRequest} from "../domain/auth/request/AuthorizationRequest";
import InternalServerError from "../errors/InternalServerError";
import BadRequestError from "../errors/BadRequestError";
import {Logger} from "../infrastructures/Logger";
import {Authlete} from "../config/Authlete";
import {AuthorizationRepositoryInterface} from "../domain/auth/AuthorizationRepositoryInterface";

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
      throw new InternalServerError();
    }

    const authorizationIssueResponse: AuthleteResponse.AuthorizationIssueResponse = response.data;
    const action = authorizationIssueResponse.action.toString();

    switch (action) {
      case "LOCATION":
        const authorizationCodeEntity = new AuthorizationCodeEntity(authorizationIssueResponse);
        return authorizationCodeEntity;
      case "BAD_REQUEST":
        throw new BadRequestError(authorizationIssueResponse.resultMessage);
      default:
        Logger.critical(authorizationIssueResponse);
        throw new InternalServerError(authorizationIssueResponse.resultMessage);
    }
  }

  /**
   * 認可ticketを発行する
   *
   * @param authorizationRequest
   * @returns {Promise<AuthleteResponse.Authorization>}
   */
  private async issueAuthorizationTicket(authorizationRequest: AuthorizationRequest.Request): Promise<AuthleteResponse.Authorization> {

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

    const response: AxiosResponse = await axios.post("https://api.authlete.com/api/auth/authorization", requestData, requestConfig);
    if (response.status !== 200) {
      Logger.critical(response);
      throw new InternalServerError();
    }

    const authorizationResponse: AuthleteResponse.Authorization = response.data;
    const action = authorizationResponse.action.toString();
    switch (action) {
      case "INTERACTION":
        return authorizationResponse;
      case "BAD_REQUEST":
        throw new BadRequestError(authorizationResponse.resultMessage);
      case "INTERNAL_SERVER_ERROR":
        Logger.critical(authorizationResponse);
        throw new InternalServerError(authorizationResponse.resultMessage);
      default:
        Logger.critical(authorizationResponse);
        throw new InternalServerError(authorizationResponse.resultMessage);
    }
  }
}
