import {AxiosInstance} from "axios";
import {AxiosResponse} from "axios";
import {AccessTokenEntity} from "../domain/auth/AccessTokenEntity";
import {AccessTokenRepositoryInterface} from "../domain/auth/AccessTokenRepositoryInterface";
import BadRequestError from "../errors/BadRequestError";
import InternalServerError from "../errors/InternalServerError";
import {Logger} from "../infrastructures/Logger";
import {AuthleteAPIConstant} from "../types/authlete/AuthleteAPIConstant";
import {AuthleteAPI} from "../types/authlete/types";

/**
 * AccessTokenRepository
 *
 * @author keita-nishimoto
 * @since 2017-01-23
 */
export default class AccessTokenRepository implements AccessTokenRepositoryInterface {

  /**
   * constructor
   *
   * @param axiosInstance
   */
  constructor(private axiosInstance: AxiosInstance) {
  }

  /**
   * アクセストークンを取得する
   * AuthleteのイントロスペクションAPIを利用する
   *
   * @param accessToken
   * @returns {Promise<AccessTokenEntity.Entity>}
   */
  public async fetch(accessToken: string): Promise<AccessTokenEntity.Entity> {
    try {
      const requestData = {
        token: accessToken,
      };

      const response: AxiosResponse = await this.axiosInstance.post(
        "https://api.authlete.com/api/auth/introspection",
        requestData,
      );

      if (response.status !== 200) {
        Logger.critical(response);
        return Promise.reject(new InternalServerError());
      }

      const introspectionResponse: AuthleteAPI.IntrospectionResponse = response.data;

      const builder = new AccessTokenEntity.Builder();
      builder.accessToken = accessToken;
      builder.introspectionResponse = introspectionResponse;

      return builder.build();
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
   * @returns {Promise<AccessTokenEntity.Entity>}
   */
  public async issue(authorizationCode: string, redirectUri: string): Promise<AccessTokenEntity.Entity> {
    try {
      const requestData = {
        parameters: `code=${authorizationCode}&grant_type=authorization_code&redirect_uri=${redirectUri}`,
      };

      const response: AxiosResponse = await this.axiosInstance.post(
        "https://api.authlete.com/api/auth/token",
        requestData,
      );

      if (response.status !== 200) {
        console.error(response);
        return Promise.reject(new InternalServerError());
      }

      const tokenResponse: AuthleteAPI.TokenResponse = response.data;
      const builder = new AccessTokenEntity.Builder();
      builder.accessToken = tokenResponse.accessToken;
      builder.tokenResponse = tokenResponse;

      const accessTokenEntity = builder.build();

      if (accessTokenEntity.extractTokenAction() !== AuthleteAPIConstant.TokenResponseActions.OK) {
        switch (accessTokenEntity.extractTokenAction()) {
          case AuthleteAPIConstant.TokenResponseActions.BAD_REQUEST:
          case AuthleteAPIConstant.TokenResponseActions.INVALID_CLIENT:
            return Promise.reject(
              new BadRequestError(accessTokenEntity.tokenResponse.resultMessage),
            );
          default:
            Logger.critical(accessTokenEntity.tokenResponse);
            return Promise.reject(
              new InternalServerError(accessTokenEntity.tokenResponse.resultMessage),
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
