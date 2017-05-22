import axios from "axios";
import {AxiosInstance} from "axios";
import {AxiosAdapter} from "axios";
import {Authlete} from "../../config/Authlete";

/**
 * TestUtil
 * テストに利用する汎用ライブラリ（大きくなってきたら分離する）
 *
 * @author keita-nishimoto
 * @since 2017-02-28
 */
export class TestUtil {

  /**
   * APIGatewayのURIを作成する
   *
   * @returns {string}
   */
  public static createGatewayUri() {
    const baseUri    = process.env.GATEWAY_BASE_URI;
    const stage      = process.env.DEPLOY_STAGE;
    let gatewayUri = `${baseUri}/${stage}`;

    if (process.env.IS_LOCAL) {
      gatewayUri = "http://localhost:3000";
    }

    return gatewayUri;
  }

  /**
   * モック用のAxiosInstance（HTTPクライアント）を生成する
   *
   * @param mockAdapter
   * @returns {AxiosInstance}
   */
  public static createMockAxiosInstance(mockAdapter: AxiosAdapter): AxiosInstance {
    const headers = {
      "Content-Type": "application/json",
    };

    const requestConfig = {
      headers,
      auth: {
        username: Authlete.getApiKey(),
        password: Authlete.getApiSecret(),
      },
      adapter: mockAdapter,
    };

    return axios.create(requestConfig);
  }
}
