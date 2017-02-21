import * as request from "request";
import {Error} from "tslint/lib/error";
import {IntrospectionResponseInterface} from "../domain/auth/IntrospectionResponseInterface";
import {AccessTokenRepositoryInterface} from "../domain/auth/AccessTokenRepositoryInterface";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";
import AccessTokenEntity from "../domain/auth/AccessTokenEntity";

/**
 * AccessTokenRepository
 *
 * @author keita-nishimoto
 * @since 2016-01-23
 */
export default class AccessTokenRepository implements AccessTokenRepositoryInterface {

  /**
   * アクセストークンを取得する
   * AuthleteのイントロスペクションAPIを利用する
   *
   * @param accessToken
   * @returns {Promise<AccessTokenEntity>}
   */
  fetch(accessToken: string): Promise<AccessTokenEntity> {
    const headers = {
      "Content-Type": "application/json"
    };

    const options = {
      url: "https://api.authlete.com/api/auth/introspection",
      method: "POST",
      auth: {
        username: this.getAuthleteApiKey(),
        pass: this.getAuthleteApiSecret()
      },
      headers: headers,
      json: true,
      body: {
        token: accessToken
      }
    };

    return new Promise<AccessTokenEntity>((resolve: Function, reject: Function) => {
      request(options, (error: Error, response: any, introspectionResponse: IntrospectionResponseInterface) => {
        try {
          if (error) {
            reject(error);
          }

          if (response.statusCode !== 200) {
            reject(new Error("Internal Server Error"));
          }

          const accessTokenEntity = new AccessTokenEntity(
            accessToken,
            introspectionResponse
          );

          resolve(accessTokenEntity);

        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * 認可コードからアクセストークンを発行する
   *
   * @param authorizationCode
   * @param redirectUri
   * @returns {Promise<AccessTokenEntity>}
   */
  issue(authorizationCode: string, redirectUri: string): Promise<AccessTokenEntity> {

    const headers = {
      "Content-Type": "application/json"
    };

    const options = {
      url: "https://api.authlete.com/api/auth/token",
      method: "POST",
      auth: {
        username: this.getAuthleteApiKey(),
        pass: this.getAuthleteApiSecret()
      },
      json: true,
      headers: headers,
      body: {
        parameters: `code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${redirectUri}`
      }
    };

    return new Promise((resolve: Function, reject: Function) => {
      request(options, (error: Error, response: any, tokenResponse: AuthleteResponse.TokenResponse) => {
        try {
          // TODO エラー処理が十分ではない。クライアントタイプがCONFIDENTIALの場合、現在のコードでは正常に動作しないので解消する。 @keita-nishimoto
          if (error) {
            reject(error);
          }

          if (response.statusCode !== 200) {
            console.error(response);
            reject(new Error("Internal Server Error"));
          }

          const accessTokenEntity = new AccessTokenEntity(tokenResponse.accessToken);
          accessTokenEntity.tokenResponse = tokenResponse;

          // TODO アクションに応じて返すエラーを分岐する。 @keita-koga
          if (accessTokenEntity.extractTokenAction() !== "OK") {
            reject(
              new Error(
                accessTokenEntity.tokenResponse.responseContent
              )
            );
          }

          resolve(accessTokenEntity);

        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * 環境変数からAuthleteのAPIキーを取得する
   *
   * @returns {string}
   */
  private getAuthleteApiKey(): string {
    return process.env.AUTHLETE_API_KEY;
  }

  /**
   * 環境変数からAuthleteのAPIシークレットを取得する
   *
   * @returns {string}
   */
  private getAuthleteApiSecret(): string {
    return process.env.AUTHLETE_API_SECRET;
  }
}
