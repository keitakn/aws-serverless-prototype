import axios from "axios";
import {AxiosInstance} from "axios";
import {Authlete} from "../config/Authlete";

/**
 * AuthleteHttpClientFactory
 * Authlete API用のHTTPクライアントを作成する
 *
 * @author keita-nishimoto
 * @since 2017-03-23
 */
export default class AuthleteHttpClientFactory {

  /**
   * HTTPクライアント（Axios）を生成する
   *
   * @returns {AxiosInstance}
   */
  public static create(): AxiosInstance {
    const headers = {
      "Content-Type": "application/json",
    };

    const requestConfig = {
      headers,
      auth: {
        username: Authlete.getApiKey(),
        password: Authlete.getApiSecret(),
      },
    };

    return axios.create(requestConfig);
  }
}
