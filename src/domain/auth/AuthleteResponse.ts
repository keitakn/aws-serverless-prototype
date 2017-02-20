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

  /**
   * actionのデータ型（/auth/token API）
   * レスポンスで返すべきHTTPステータスが設定される
   */
  type TokenResponseActions = "OK | PASSWORD | BAD_REQUEST | INTERNAL_SERVER_ERROR | INVALID_CLIENT";

  /**
   * /auth/token APIのレスポンス
   */
  export interface TokenResponse {

    /**
     * アクセストークン
     */
    accessToken: string;

    /**
     * アクセストークン有効期限の長さ（秒単位）
     */
    accessTokenDuration: number;

    /**
     * アクセストークンの有効期限を表すタイムスタンプ
     */
    accessTokenExpiresAt: number;

    /**
     * レスポンスで返すべきHTTPステータスが設定される
     */
    action: TokenResponseActions;

    /**
     * IDトークン
     */
    idToken: string;

    /**
     * リフレッシュトークン
     */
    refreshToken: string;

    /**
     * リフレッシュトークン有効期限の長さ（秒単位）
     */
    refreshTokenDuration: number;

    /**
     * リフレッシュトークンの有効期限を表すタイムスタンプ
     */
    refreshTokenExpiresAt: number;

    /**
     * クライアントに返却すべきレスポンス（JSON形式）
     * レスポンスに含める際はJSON.stringify() を利用する必要はない。
     */
    responseContent: string;
  }

  /**
   * OpenID Connect Dynamic Client Registration 1.0, 2. Client Metadata.
   */
  type ApplicationType = "WEB | NATIVE";

  /**
   * RFC 6749, 2.1. Client Types.
   */
  type ClientType = "CONFIDENTIAL | PUBLIC";

  /**
   * OAuth 2.0 supportedGrantTypes
   */
  type GrantType = "AUTHORIZATION_CODE | IMPLICIT | PASSWORD | CLIENT_CREDENTIALS | REFRESH_TOKEN";

  /**
   * OAuth 2.0 Response Type
   */
  type ResponseType = "NONE | CODE | TOKEN | ID_TOKEN | CODE_TOKEN | CODE_ID_TOKEN | ID_TOKEN_TOKEN | CODE_ID_TOKEN_TOKEN";

  /**
   * クライアント作成のレスポンス
   */
  export interface ClientCreateResponse {
    /**
     * OpenID Connect Dynamic Client Registration 1.0, 2. Client Metadata.
     */
    applicationType: ApplicationType;

    /**
     * クライアントID
     */
    clientId: number;

    /**
     * クライアント名
     */
    clientName: string;

    /**
     * クライアントシークレット
     */
    clientSecret: string;

    /**
     * RFC 6749, 2.1. Client Types.
     */
    clientType: ClientType;

    /**
     * 作成日時（UnixTime）
     */
    createdAt: number;

    /**
     * 更新日時（UnixTime）
     */
    modifiedAt: number;

    /**
     * 開発者
     */
    developer: string;

    /**
     * OAuth 2.0 supportedGrantTypes
     */
    grantTypes: [GrantType];

    /**
     * リダイレクトURI
     */
    redirectUris: [string]

    /**
     * OAuth 2.0 Response Type
     */
    responseTypes: [ResponseType];
  }
}
