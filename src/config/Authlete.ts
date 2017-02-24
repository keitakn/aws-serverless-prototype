/**
 * Authlete
 * OAuth 2.0 server & OpenID providerサービス Authleteの設定情報を管理する
 *
 * @author keita-nishimoto
 * @since 2017-02-24
 * @link https://www.authlete.com/
 */
export class Authlete {

  /**
   * 環境変数からAuthleteのAPIキーを取得する
   *
   * @returns {string}
   */
  static getApiKey(): string {
    return process.env.AUTHLETE_API_KEY;
  }

  /**
   * 環境変数からAuthleteのAPIシークレットを取得する
   *
   * @returns {string}
   */
  static getApiSecret(): string {
    return process.env.AUTHLETE_API_SECRET;
  }
}
