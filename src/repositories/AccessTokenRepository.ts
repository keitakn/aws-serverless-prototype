import * as request from "request";
import {Error} from "tslint/lib/error";
import {AccessTokenRepositoryInterface} from "../domain/auth/AccessTokenRepositoryInterface";
import {AuthleteResponse} from "../domain/auth/AuthleteResponse";
import AccessTokenEntity from "../domain/auth/AccessTokenEntity";
import BadRequestError from "../errors/BadRequestError";
import ForbiddenError from "../errors/ForbiddenError";
import InternalServerError from "../errors/InternalServerError";
import {Logger} from "../infrastructures/Logger";
import {Authlete} from "../config/Authlete";

/**
 * AccessTokenRepository
 *
 * @author keita-nishimoto
 * @since 2017-01-23
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
    return new Promise<AccessTokenEntity>((resolve: Function, reject: Function) => {
      const headers = {
        "Content-Type": "application/json"
      };

      const options = {
        url: "https://api.authlete.com/api/auth/introspection",
        method: "POST",
        auth: {
          username: Authlete.getApiKey(),
          pass: Authlete.getApiSecret()
        },
        headers: headers,
        json: true,
        body: {
          token: accessToken
        }
      };

      request(options, (error: Error, response: any, introspectionResponse: AuthleteResponse.IntrospectionResponse) => {
        try {
          if (error) {
            Logger.critical(error);
            reject(
              new InternalServerError(error.message)
            );
          }

          if (response.statusCode !== 200) {
            Logger.critical(response);
            reject(new InternalServerError());
          }

          const accessTokenEntity = new AccessTokenEntity(
            accessToken,
            introspectionResponse
          );

          resolve(accessTokenEntity);

        } catch (error) {
          Logger.critical(error);
          reject(new InternalServerError());
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
    return new Promise((resolve: Function, reject: Function) => {
      const headers = {
        "Content-Type": "application/json"
      };

      const options = {
        url: "https://api.authlete.com/api/auth/token",
        method: "POST",
        auth: {
          username: Authlete.getApiKey(),
          pass: Authlete.getApiSecret()
        },
        json: true,
        headers: headers,
        body: {
          parameters: `code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${redirectUri}`
        }
      };

      request(options, (error: Error, response: any, tokenResponse: AuthleteResponse.TokenResponse) => {
        try {
          if (error) {
            Logger.critical(error);
            reject(
              new InternalServerError(error.message)
            );
          }

          if (response.statusCode !== 200) {
            console.error(response);
            reject(
              new InternalServerError()
            );
          }

          const accessTokenEntity = new AccessTokenEntity(tokenResponse.accessToken);
          accessTokenEntity.tokenResponse = tokenResponse;

          if (accessTokenEntity.extractTokenAction() !== "OK") {
            switch (accessTokenEntity.extractTokenAction()) {
              case "BAD_REQUEST":
                reject(
                  new BadRequestError(accessTokenEntity.tokenResponse.resultMessage)
                );
                break;
              case "FORBIDDEN":
                reject(
                  new ForbiddenError(accessTokenEntity.tokenResponse.resultMessage)
                );
                break;
              default:
                Logger.critical(accessTokenEntity.tokenResponse);
                reject(
                  new InternalServerError(accessTokenEntity.tokenResponse.resultMessage)
                );
                break;
            }
          }

          resolve(accessTokenEntity);

        } catch (error) {
          Logger.critical(error);
          reject(new InternalServerError());
        }
      });
    });
  }
}
