/**
 * AuthleteResponse
 *
 * @author keita-nishimoto
 * @since 2017-02-16
 */
export namespace AuthleteResponse
{
  /**
   * Introspectionレスポンスで返すべきHTTPステータスが設定される
   */
  type IntrospectionActions = "OK" | "BAD_REQUEST" | "FORBIDDEN" | "UNAUTHORIZED" | "INTERNAL_SERVER_ERROR";

  /**
   * IntrospectionResponse
   * AuthleteのイントロスペクションAPIの結果
   *
   * @author keita-nishimoto
   * @since 2017-01-25
   */
  export interface IntrospectionResponse {
    /**
     * イントロスペクションAPIの結果コード
     */
    resultCode: string;

    /**
     * イントロスペクションAPIの結果メッセージ
     */
    resultMessage: string;

    /**
     * レスポンスで返すべきHTTPステータスが設定される
     * 設定される可能性があるのは以下の値
     *
     * - OK
     * - BAD_REQUEST
     * - FORBIDDEN
     * - UNAUTHORIZED
     * - INTERNAL_SERVER_ERROR
     */
    action: IntrospectionActions;

    /**
     * アクセストークンに紐付いているクライアントID
     * 有効でないアクセストークンをリクエストした場合0が設定される
     */
    clientId: number;

    /**
     * レスポンスの詳細
     */
    responseContent: string;

    /**
     * アクセストークンが利用出来るスコープ
     * 以下のような配列が設定される
     *
     * ['email', 'address']
     */
    scopes: [string];

    /**
     * アクセストークンに紐付いているユーザーの識別子
     * クライアントクレデンシャル等、アクセストークンにユーザーが紐付かない場合はこの値は設定されない
     */
    subject: string;
  }

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
     * APIの結果メッセージ
     */
    resultMessage: string;

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
     * APIの結果メッセージ
     */
    resultMessage: string;

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
  type TokenResponseActions = "OK | BAD_REQUEST | FORBIDDEN | INTERNAL_SERVER_ERROR";

  /**
   * /auth/token APIのレスポンス
   */
  export interface TokenResponse {

    /**
     * APIの結果メッセージ
     */
    resultMessage: string;

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
   * クライアントのレスポンス
   */
  export interface ClientResponse {
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

    /**
     * クライアントが持てる拡張情報
     */
    extension: {
      // リクエスト可能なscope一覧
      requestableScopes: [string]
    }
  }
}
