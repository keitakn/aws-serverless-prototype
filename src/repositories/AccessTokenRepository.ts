import axios from "axios";
import {AxiosResponse} from "axios";
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
  async fetch(accessToken: string): Promise<AccessTokenEntity> {
    try {
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

      const response: AxiosResponse = await axios.post(
        "https://api.authlete.com/api/auth/introspection",
        requestData,
        requestConfig
      );

      if (response.status !== 200) {
        Logger.critical(response);
        return Promise.reject(new InternalServerError());
      }

      const introspectionResponse: AuthleteResponse.IntrospectionResponse = response.data;
      const accessTokenEntity = new AccessTokenEntity(
        accessToken
      );
      accessTokenEntity.introspectionResponse = introspectionResponse;

      return accessTokenEntity;
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(error);
    }
  }

  /**
   * 認可コードからアクセストークンを発行する
   *
   * @param authorizationCode
   * @param redirectUri
   * @returns {Promise<AccessTokenEntity>}
   */
  async issue(authorizationCode: string, redirectUri: string): Promise<AccessTokenEntity> {
    try {
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

      const response: AxiosResponse = await axios.post(
        "https://api.authlete.com/api/auth/token",
        requestData,
        requestConfig
      );

      if (response.status !== 200) {
        console.error(response);
        return Promise.reject(new InternalServerError());
      }

      const tokenResponse: AuthleteResponse.TokenResponse = response.data;
      const accessTokenEntity = new AccessTokenEntity(tokenResponse.accessToken);
      accessTokenEntity.tokenResponse = tokenResponse;

      if (accessTokenEntity.extractTokenAction() !== "OK") {
        switch (accessTokenEntity.extractTokenAction()) {
          case "BAD_REQUEST":
            return Promise.reject(
              new BadRequestError(accessTokenEntity.tokenResponse.resultMessage)
            );
          case "FORBIDDEN":
            return Promise.reject(
              new ForbiddenError(accessTokenEntity.tokenResponse.resultMessage)
            );
          default:
            Logger.critical(accessTokenEntity.tokenResponse);
            return Promise.reject(
              new InternalServerError(accessTokenEntity.tokenResponse.resultMessage)
            );
        }
      }

      return accessTokenEntity;
    } catch (error) {
      Logger.critical(error);
      return Promise.reject(error);
    }
  }
}
