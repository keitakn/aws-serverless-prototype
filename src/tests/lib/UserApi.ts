import axios from "axios";
import {AxiosResponse} from "axios";
import {AxiosError} from "axios";
import {TestUtil} from "./TestUtil";

/**
 * User系APIのテスト用ライブラリ
 */
export namespace UserApi {

  /**
   * ユーザー作成のリクエスト
   *
   * @link https://www.authlete.com/documents/apis/reference#auth_token_create
   */
  export interface CreateUserRequest {
    email: string;
    password: string;
    name: string;
    gender: string;
    birthdate: string;
  }

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
     * @returns {Promise<AxiosResponse>}
     */
    static create(request: CreateUserRequest, accessToken: string): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const headers = {
          "Content-type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        };

        const requestConfig = {
          headers: headers
        };
        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/users`;

        axios.post(
          requestUri,
          request,
          requestConfig
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
     * @returns {Promise<AxiosResponse>}
     */
    static find(userId: string): Promise<AxiosResponse> {
      return new Promise<AxiosResponse>((resolve: Function, reject: Function) => {
        const baseUri = TestUtil.createGatewayUri();
        const requestUri = `${baseUri}/users/${userId}`;

        axios.get(
          requestUri
        ).then((response: AxiosResponse) => {
          resolve(response);
        }).catch((error: AxiosError) => {
          reject(error);
        });
      });
    }
  }
}
