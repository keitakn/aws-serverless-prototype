import axios from "axios";
import {AxiosResponse} from "axios";

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

        const baseUri    = process.env.GATEWAY_BASE_URI;
        const stage      = process.env.DEPLOY_STAGE;
        const requestUri = `${baseUri}/${stage}/auth/authorization/code`;

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


