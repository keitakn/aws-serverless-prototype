import axios from "axios";
import {AxiosResponse} from "axios";
import {TestUtil} from "./TestUtil";

/**
 * Client系APIのテスト用ライブラリ
 */
export namespace ClientApi {

  /**
   * ApiClient
   *
   * @author keita-nishimoto
   * @since 2017-03-09
   */
  export class ApiClient {
    /**
     * クライアントを取得する
     *
     * @param clientId
     * @param accessToken
     * @returns {Promise<AxiosResponse>}
     */
    static find(clientId: number, accessToken: string): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        };

        const requestConfig = {
          headers: headers
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/clients/${clientId}`;

        axios.get(
          requestUri,
          requestConfig
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }
}
