import axios from "axios";
import {AxiosResponse} from "axios";
import {ResourceRequest} from "../../domain/resource/request/ResourceRequest";
import {TestUtil} from "./TestUtil";

/**
 * Resource系APIのテスト用ライブラリ
 */
export namespace ResourceTest {

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
    public static create(request: ResourceRequest.CreateRequest): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
        };

        const requestConfig = {
          headers,
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/resources`;

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
     * リソースを取得する
     *
     * @param resourceId
     * @returns {Promise<AxiosResponse>}
     */
    public static find(resourceId: string): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
        };

        const requestConfig = {
          headers,
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/resources/${resourceId}`;

        axios.get(
          requestUri,
          requestConfig,
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
     * @param resourceId
     * @returns {Promise<AxiosResponse>}
     */
    public static destroy(resourceId: string): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
        };

        const requestConfig = {
          headers,
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/resources/${resourceId}`;

        axios.delete(
          requestUri,
          requestConfig,
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }
}
