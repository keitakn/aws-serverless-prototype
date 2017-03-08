import axios from "axios";
import {AxiosResponse} from "axios";
import {TestUtil} from "./TestUtil";

/**
 * Resource系APIのテスト用ライブラリ
 */
export namespace ResourceApi {

  /**
   * リソース作成のリクエスト
   */
  export interface CreateRequest {
    http_method: string;
    resource_path: string;
    name: string;
    scopes: [string];
  }

  /**
   * リソース削除のリクエスト
   */
  export interface DestroyRequest {
    http_method: string;
    resource_path: string;
  }

  /**
   * ApiClient
   *
   * @author keita-nishimoto
   * @since 2017-03-08
   */
  export class ApiClient {
    /**
     * リソースを作成する
     *
     * @param request
     * @returns {Promise<AxiosResponse>}
     */
    static create(request: CreateRequest) {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json"
        };

        const requestConfig = {
          headers: headers
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/resource`;

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
     * リソース削除を削除する
     *
     * @param request
     * @returns {Promise<AxiosResponse>}
     */
    static destroy(request: DestroyRequest) {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json"
        };

        const requestConfig = {
          headers: headers,
          data: request
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/resource`;

        axios.delete(
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
