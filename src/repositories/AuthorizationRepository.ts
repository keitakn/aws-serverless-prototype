import * as request from "request";

/**
 * AuthorizationRepository
 *
 * @author keita-nishimoto
 * @since 2016-02-15
 */
export class AuthorizationRepository {

  /**
   * 認可ticketを作成する
   *
   * @param clientId
   * @param state
   * @returns {Promise<T>}
   */
  createAuthorizationTicket(clientId: number, state: string) {

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
      request(options, (error: Error, response: any, body: any) => {

        try {
          if (error) {
            reject(error);
          }
          resolve(body);

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
