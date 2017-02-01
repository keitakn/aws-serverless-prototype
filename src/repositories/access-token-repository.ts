import * as request from "request";
import {Error} from "tslint/lib/error";
import AccessTokenEntity from "../domain/auth/access-token-entity";
import {IntrospectionResponseInterface} from "../domain/auth/introspection-response-interface";
import {AccessTokenRepositoryInterface} from "../domain/auth/access-token-repository-interface";

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
    // TODO これは環境設定ファイル等から読み込むように変更する。 @keita-nishimoto
    const API_KEY    = "";
    const API_SECRET = "";

    const headers = {
      "Content-Type": "application/json"
    };

    const options = {
      url: "https://api.authlete.com/api/auth/introspection",
      method: "POST",
      auth: {
        username: API_KEY,
        pass: API_SECRET
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
}
