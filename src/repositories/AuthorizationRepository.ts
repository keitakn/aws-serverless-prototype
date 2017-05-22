import {AxiosInstance} from "axios";
import {AxiosResponse} from "axios";
import {AuthorizationCodeEntity} from "../domain/auth/AuthorizationCodeEntity";
import {AuthorizationRepositoryInterface} from "../domain/auth/AuthorizationRepositoryInterface";
import {AuthRequest} from "../domain/auth/request/AuthRequest";
import BadRequestError from "../errors/BadRequestError";
import InternalServerError from "../errors/InternalServerError";
import {Logger} from "../infrastructures/Logger";
import {AuthleteAPIConstant} from "../types/authlete/AuthleteAPIConstant";
import {AuthleteAPI} from "../types/authlete/types";

/**
 * AuthorizationRepository
 *
 * @author keita-nishimoto
 * @since 2017-02-15
 */
export class AuthorizationRepository implements AuthorizationRepositoryInterface {

  /**
   * constructor
   *
   * @param axiosInstance
   */
  constructor(private axiosInstance: AxiosInstance) {
  }

  /**
   * 認可コードを発行する
   *
   * @param request
   * @returns {Promise<AuthorizationCodeEntity.Entity>}
   */
  public async issueAuthorizationCode(request: AuthRequest.IssueAuthorizationCodeRequest): Promise<AuthorizationCodeEntity.Entity> {
    try {
      const authorizationResponse = await this.issueAuthorizationTicket(request);

      const requestData = {
        ticket: authorizationResponse.ticket,
        subject: request.subject,
      };

      const response: AxiosResponse = await this.axiosInstance.post(
        "https://api.authlete.com/api/auth/authorization/issue",
        requestData,
      );

      if (response.status !== 200) {
        Logger.critical(response);
        return Promise.reject(
          new InternalServerError(),
        );
      }

      const authorizationIssueResponse: AuthleteAPI.AuthorizationIssueResponse = response.data;
      const action = authorizationIssueResponse.action.toString();

      switch (action) {
        case AuthleteAPIConstant.AuthorizationIssueActions.LOCATION:
          const builder = new AuthorizationCodeEntity.Builder();
          builder.authorizationIssueResponse = authorizationIssueResponse;
          return new AuthorizationCodeEntity.Entity(builder);
        case AuthleteAPIConstant.AuthorizationIssueActions.BAD_REQUEST:
          return Promise.reject(
            new BadRequestError(authorizationIssueResponse.resultMessage),
          );
        default:
          Logger.critical(authorizationIssueResponse);
          return Promise.reject(
            new InternalServerError(authorizationIssueResponse.resultMessage),
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
   * @param request
   * @returns {Promise<AuthleteAPI.Authorization>}
   */
  private async issueAuthorizationTicket(request: AuthRequest.IssueAuthorizationCodeRequest): Promise<AuthleteAPI.AuthorizationResponse> {
    try {
      const clientId    = request.client_id;
      const state       = request.state;
      const redirectUri = request.redirect_uri;

      let scopes = "openid";
      request.scopes.map((scope) => {
        if (scope !== "openid") {
          scopes += "%20" + scope;
        }
      });

      const requestData = {
        parameters: `client_id=${clientId}&response_type=code&state=${state}&scope=${scopes}&redirect_uri=${redirectUri}`,
      };

      const response: AxiosResponse = await this.axiosInstance.post(
        "https://api.authlete.com/api/auth/authorization",
        requestData,
      );

      if (response.status !== 200) {
        Logger.critical(response);
        return Promise.reject(
          new InternalServerError(),
        );
      }

      const authorizationResponse: AuthleteAPI.AuthorizationResponse = response.data;
      const action = authorizationResponse.action.toString();
      switch (action) {
        case AuthleteAPIConstant.AuthorizationActions.INTERACTION:
          return authorizationResponse;
        case AuthleteAPIConstant.AuthorizationActions.BAD_REQUEST:
          return Promise.reject(
            new BadRequestError(authorizationResponse.resultMessage),
          );
        case AuthleteAPIConstant.AuthorizationActions.INTERNAL_SERVER_ERROR:
          Logger.critical(authorizationResponse);
          return Promise.reject(
            new InternalServerError(authorizationResponse.resultMessage),
          );
        default:
          Logger.critical(authorizationResponse);
          return Promise.reject(
            new InternalServerError(authorizationResponse.resultMessage),
          );
      }
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(error);
    }
  }
}
