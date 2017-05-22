import axios from "axios";
import {AxiosResponse} from "axios";
import {AxiosError} from "axios";
import {Authlete} from "../../config/Authlete";
import {AuthRequest} from "../../domain/auth/request/AuthRequest";
import {TokenRequest} from "../../domain/token/request/TokenRequest";
import {AuthleteAPI} from "../../types/authlete/types";
import {TestUtil} from "./TestUtil";

/**
 * Auth系APIのテスト用ライブラリ
 */
export namespace AuthTest {

  /**
   * アクセストークン発行（チート）のリクエスト
   * 本来AuthRequestに定義すべきだがテストでしか使わないのでここで定義する
   *
   * @link https://www.authlete.com/documents/apis/reference#auth_token_create
   */
  export interface IssueAccessTokenInCheatApiRequest {
    grantType: AuthleteAPI.GrantTypes;
    clientId: number;
    subject?: string;
    scopes?: [string];
    accessTokenDuration?: any;
    refreshTokenDuration?: any;
    properties?: any;
  }

  /**
   * アクセストークン発行（チート）のレスポンス
   * 厳密には全ての型を定義している訳ではないがテストに使うだけなのでこれで十分
   * 本来AuthResponseに定義すべきだがテストでしか使わないのでここで定義する
   *
   * @link https://www.authlete.com/documents/apis/reference#auth_token_create
   */
  export interface IssueAccessTokenInCheatApiResponse {
    type: string;
    resultCode: string;
    resultMessage: string;
    accessToken: string;
    clientId: number;
    grantType: AuthleteAPI.GrantTypes;
    scopes: [string];
  }

  /**
   * ApiClient
   *
   * @author keita-nishimoto
   * @since 2017-02-28
   */
  export class ApiClient {

    /**
     * 認証を行う
     *
     * @param request
     * @returns {Promise<AxiosResponse>}
     */
    public static authentication(request: AuthRequest.AuthenticationRequest): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
        };

        const requestConfig = {
          headers,
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/auth/authentication`;

        axios.post(
          requestUri,
          request,
          requestConfig,
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    }

    /**
     * 認可コードを発行する
     *
     * @param request
     * @returns {Promise<AxiosResponse>}
     */
    public static issueAuthorizationCode(request: AuthRequest.IssueAuthorizationCodeRequest): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
        };

        const requestConfig = {
          headers,
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/auth/authorization/code`;

        axios.post(
          requestUri,
          request,
          requestConfig,
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    }

    /**
     * 認可コードからアクセストークンを発行する
     *
     * @param request
     * @returns {Promise<AxiosResponse>}
     */
    public static issueTokenFromCode(request: TokenRequest.IssueTokenFromCodeRequest): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
        };

        const requestConfig = {
          headers,
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/tokens/code`;

        axios.post(
          requestUri,
          request,
          requestConfig,
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    }

    /**
     * AuthleteのチートAPIを使ってアクセストークンを発行する
     * 任意のアクセストークンをお手軽に発行出来る。テスト用以外には利用しない事。
     *
     * @param request
     * @link https://www.authlete.com/documents/apis/reference#auth_token_create
     */
    public static issueAccessTokenInCheatApi(request: IssueAccessTokenInCheatApiRequest): Promise<IssueAccessTokenInCheatApiResponse> {

      return new Promise<IssueAccessTokenInCheatApiResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
        };

        const requestConfig = {
          headers,
          auth: {
            username: Authlete.getApiKey(),
            password: Authlete.getApiSecret(),
          },
        };

        axios.post("https://api.authlete.com/api/auth/token/create", request, requestConfig)
          .then((response: AxiosResponse) => {
            const tokenCreateResponse: IssueAccessTokenInCheatApiResponse = response.data;
            resolve(tokenCreateResponse);
          })
          .catch((error: AxiosError) => {
            reject(error);
          });
      });
    }
  }
}


