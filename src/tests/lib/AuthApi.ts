import axios from "axios";
import {AxiosResponse} from "axios";
import {AxiosError} from "axios";
import {TestUtil} from "./TestUtil";
import {Authlete} from "../../config/Authlete";
import {AuthleteAPI} from "../../types/authlete/types";

/**
 * Auth系APIのテスト用ライブラリ
 */
export namespace AuthApi {

  /**
   * 認証のリクエスト
   */
  export interface AuthenticationRequest {
    subject: string;
    password: string;
  }

  /**
   * 認可コード発行のリクエスト
   */
  export interface IssueAuthorizationCodeRequest {
    client_id: number;
    state: string;
    redirect_uri: string;
    subject: string;
    scopes: [string];
  }

  /**
   * アクセストークン発行（認可コード）のリクエスト
   */
  export interface IssueTokenFromCodeRequest {
    code: string;
    redirect_uri: string;
  }

  /**
   * アクセストークン発行（チート）のリクエスト
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
    static authentication(request: AuthenticationRequest): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json"
        };

        const requestConfig = {
          headers: headers
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/auth/authentication`;

        axios.post(
          requestUri,
          request,
          requestConfig
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
    static issueAuthorizationCode(request: IssueAuthorizationCodeRequest): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json"
        };

        const requestConfig = {
          headers: headers
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/auth/authorization/code`;

        axios.post(
          requestUri,
          request,
          requestConfig
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
    static issueTokenFromCode(request: IssueTokenFromCodeRequest): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json"
        };

        const requestConfig = {
          headers: headers
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/tokens/code`;

        axios.post(
          requestUri,
          request,
          requestConfig
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
    static issueAccessTokenInCheatApi(request: IssueAccessTokenInCheatApiRequest): Promise<IssueAccessTokenInCheatApiResponse> {

      return new Promise<IssueAccessTokenInCheatApiResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json"
        };

        const requestConfig = {
          headers: headers,
          auth: {
            username: Authlete.getApiKey(),
            password: Authlete.getApiSecret()
          }
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


