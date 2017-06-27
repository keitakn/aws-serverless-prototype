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
  public static getApiKey(): string {
    const apiKey = process.env.AUTHLETE_API_KEY;

    return typeof apiKey === "string" ? apiKey : "";
  }

  /**
   * 環境変数からAuthleteのAPIシークレットを取得する
   *
   * @returns {string}
   */
  public static getApiSecret(): string {
    const apiSecret = process.env.AUTHLETE_API_SECRET;

    return typeof apiSecret === "string" ? apiSecret : "";
  }
}
