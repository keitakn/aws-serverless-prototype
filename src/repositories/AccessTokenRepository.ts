import axios from "axios";
import {AxiosResponse} from "axios";
import {AxiosError} from "axios";
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

      const requestData = {
        token: accessToken
      };

      const requestConfig = {
        headers: headers,
        auth: {
          username: Authlete.getApiKey(),
          password: Authlete.getApiSecret()
        }
      };

      axios
        .post("https://api.authlete.com/api/auth/introspection", requestData, requestConfig)
        .then((response: AxiosResponse) => {

          if (response.status !== 200) {
            Logger.critical(response);
            reject(new InternalServerError());
          }

          const introspectionResponse: AuthleteResponse.IntrospectionResponse = response.data;
          const accessTokenEntity = new AccessTokenEntity(
            accessToken
          );
          accessTokenEntity.introspectionResponse = introspectionResponse;

          resolve(accessTokenEntity);
        })
        .catch((error: AxiosError) => {
          Logger.critical(error);
          reject(new InternalServerError());
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
    return new Promise<AccessTokenEntity>((resolve: Function, reject: Function) => {

      const headers = {
        "Content-Type": "application/json"
      };

      const requestData = {
        parameters: `code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${redirectUri}`
      };

      const requestConfig = {
        headers: headers,
        auth: {
          username: Authlete.getApiKey(),
          password: Authlete.getApiSecret()
        }
      };

      axios.post("https://api.authlete.com/api/auth/token", requestData, requestConfig)
        .then((response: AxiosResponse) => {

          if (response.status !== 200) {
            console.error(response);
            reject(
              new InternalServerError()
            );
          }

          const tokenResponse: AuthleteResponse.TokenResponse = response.data;
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
        })
        .catch((error: AxiosError) => {
          Logger.critical(error);
          reject(new InternalServerError());
        });
    });
  }
}
