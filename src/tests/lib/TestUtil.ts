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
  static createGatewayUri() {
    const baseUri    = process.env.GATEWAY_BASE_URI;
    const stage      = process.env.DEPLOY_STAGE;
    let gatewayUri = `${baseUri}/${stage}`;

    if (process.env.IS_LOCAL) {
      gatewayUri = "http://localhost:3000";
    }

    return gatewayUri;
  }
}
