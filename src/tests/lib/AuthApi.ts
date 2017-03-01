import axios from "axios";
import {AxiosResponse} from "axios";
import {TestUtil} from "./TestUtil";

/**
 * Auth系APIのテスト用ライブラリ
 */
export namespace AuthApi {

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
   * ApiClient
   *
   * @author keita-nishimoto
   * @since 2017-02-28
   */
  export class ApiClient {
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

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/auth/authorization/code`;

        axios.post(
          requestUri,
          request,
          headers
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
      return new Promise((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json"
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/tokens/code`;

        axios.post(
          requestUri,
          request,
          headers
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }
}


