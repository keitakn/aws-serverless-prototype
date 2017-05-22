import axios from "axios";
import {AxiosResponse} from "axios";
import {AxiosError} from "axios";
import {UserRequest} from "../../domain/user/request/UserRequest";
import {TestUtil} from "./TestUtil";

/**
 * User系APIのテスト用ライブラリ
 */
export namespace UserTest {

  /**
   * ApiClient
   *
   * @author keita-nishimoto
   * @since 2017-03-06
   */
  export class ApiClient {
    /**
     * ユーザーを作成する
     *
     * @param request
     * @param accessToken
     * @returns {Promise<AxiosResponse>}
     */
    public static create(request: UserRequest.CreateRequest, accessToken: string): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        };

        const requestConfig = {
          headers,
        };
        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/users`;

        axios.post(
          requestUri,
          request,
          requestConfig,
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error: AxiosError) => {
          reject(error);
        });
      });
    }

    /**
     * ユーザーを取得する
     *
     * @param userId
     * @param accessToken
     * @returns {Promise<AxiosResponse>}
     */
    public static find(userId: string, accessToken: string): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve, reject) => {
        const headers = {
          "Content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        };

        const requestConfig = {
          headers,
        };

        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/users/${userId}`;

        axios.get(
          requestUri,
          requestConfig,
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error: AxiosError) => {
          reject(error);
        });
      });
    }
  }
}
