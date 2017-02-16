import * as request from "request";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";

/**
 * AuthorizationRepository
 *
 * @author keita-nishimoto
 * @since 2016-02-15
 */
export class AuthorizationRepository {

  /**
   * 認可コードを作成する
   *
   * @param clientId
   * @param state
   * @returns {Promise<AuthleteResponse.AuthorizationIssueResponse>}
   */
  createAuthorizationCode(clientId: number, state: string): Promise<AuthleteResponse.AuthorizationIssueResponse> {
    return new Promise((resolve: Function, reject: Function) => {
      this.createAuthorizationTicket(clientId, state)
        .then((authorizationResponse) => {
          const headers = {
            "Content-Type": "application/json"
          };

          const params = {
            ticket: authorizationResponse.ticket,
            subject: 9999
          };

          const options = {
            url: "https://api.authlete.com/api/auth/authorization/issue",
            method: "POST",
            auth: {
              username: this.getAuthleteApiKey(),
              pass: this.getAuthleteApiSecret()
            },
            json: true,
            headers: headers,
            body: params
          };

          request(options, (error: Error, response: any, authorizationIssueResponse: AuthleteResponse.AuthorizationIssueResponse) => {
            try {
              if (error) {
                reject(error);
              }

              if (response.statusCode !== 200) {
                console.error(response);
                reject(new Error("Internal Server Error"));
              }

              resolve(authorizationIssueResponse);
            } catch (error) {
              reject(error);
            }
          });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  /**
   * 認可ticketを作成する
   *
   * @param clientId
   * @param state
   * @returns {Promise<AuthleteResponse.Authorization>}
   */
  private createAuthorizationTicket(clientId: number, state: string): Promise<AuthleteResponse.Authorization> {

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };

    // TODO この方法でないとAPIがBAD REQUESTエラーを返してきた。もう少しシンプルに書けないか検討。 @keita-koga
    const options = {
      url: "https://api.authlete.com/api/auth/authorization",
      method: "POST",
      auth: {
        username: this.getAuthleteApiKey(),
        pass: this.getAuthleteApiSecret()
      },
      json: true,
      headers: headers,
      form: `parameters=client_id%3D${clientId}%26response_type%3Dcode%26state%3D${state}`
    };

    return new Promise((resolve: Function, reject: Function) => {
      request(options, (error: Error, response: any, authorizationResponse: AuthleteResponse.Authorization) => {
        try {
          if (error) {
            reject(error);
          }

          if (response.statusCode !== 200) {
            console.error(response);
            reject(new Error("Internal Server Error"));
          }

          resolve(authorizationResponse);

        } catch (error) {
          reject(error);
        }
      })
    });
  }

  /**
   * 環境変数からAuthleteのAPIキーを取得する
   *
   * @todo AccessTokenRepositoryに同名のメソッドがあるので共通化する @keita-koga
   * @returns {string}
   */
  private getAuthleteApiKey(): string {
    return process.env.AUTHLETE_API_KEY;
  }

  /**
   * 環境変数からAuthleteのAPIシークレットを取得する
   *
   * @todo AccessTokenRepositoryに同名のメソッドがあるので共通化する @keita-koga
   * @returns {string}
   */
  private getAuthleteApiSecret(): string {
    return process.env.AUTHLETE_API_SECRET;
  }
}
