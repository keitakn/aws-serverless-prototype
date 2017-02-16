/**
 * AuthleteResponse
 *
 * @author keita-nishimoto
 * @since 2016-02-16
 */
export namespace AuthleteResponse
{
  /**
   * actionのデータ型（/auth/authorization API）
   * レスポンスで返すべきHTTPステータスが設定される
   */
  type AuthorizationActions = "INTERNAL_SERVER_ERROR" | "BAD_REQUEST" | "LOCATION" | "FORM" | "NO_INTERACTION" | "INTERACTION";

  /**
   * /auth/authorization APIのレスポンス
   */
  export interface Authorization {
    /**
     * レスポンスで返すべきHTTPステータスが設定される
     */
    action: AuthorizationActions;

    /**
     * 認可コードの発行に必要な値
     */
    ticket: string;
  }

  /**
   * actionのデータ型（/auth/authorization/issue API）
   * レスポンスで返すべきHTTPステータスが設定される
   */
  type AuthorizationIssueActions = "INTERNAL_SERVER_ERROR | BAD_REQUEST | LOCATION | FORM";

  /**
   * /auth/authorization/issue APIのレスポンス
   */
  export interface AuthorizationIssueResponse {
    /**
     * レスポンスで返すべきHTTPステータスが設定される
     */
    action: AuthorizationIssueActions;

    /**
     * 認可コード
     */
    authorizationCode: string;

    /**
     * リダイレクトURI + 認可コード等のqueryパラメータが付与されたURI
     */
    responseContent: string;
  }
}
