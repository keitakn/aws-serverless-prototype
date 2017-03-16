/**
 * TokenRequest
 * アクセストークン系APIのリクエスト型定義
 *
 * @author keita-nishimoto
 * @since 2017-03-16
 */
export namespace TokenRequest {

  /**
   * 認可コードからアクセストークンを発行するAPIのRequest
   */
  export interface IssueTokenFromCodeRequest {
    code: string;
    redirect_uri: string;
  }
}
