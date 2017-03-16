/**
 * AuthRequest
 * Auth系APIのリクエスト型定義
 *
 * @author keita-nishimoto
 * @since 2017-03-15
 */
export namespace AuthRequest {
  /**
   * 認証のリクエスト
   */
  export interface AuthenticationRequest {
    subject: string;
    password: string;
  }

  /**
   * 認可コード発行のリクエスト
   */
  export interface IssueAuthorizationCodeRequest {
    client_id: number;
    state: string;
    redirect_uri: string;
    subject: string;
    scopes: [string];
  }
}
