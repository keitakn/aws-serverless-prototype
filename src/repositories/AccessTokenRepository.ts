import * as request from "request";
import {Error} from "tslint/lib/error";
import AccessTokenEntity from "../domain/auth/AccessTokenEntity";
import {IntrospectionResponseInterface} from "../domain/auth/IntrospectionResponseInterface";
import {AccessTokenRepositoryInterface} from "../domain/auth/AccessTokenRepositoryInterface";

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
