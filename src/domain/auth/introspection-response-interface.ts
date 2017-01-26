type Actions = "OK" | "BAD_REQUEST" | "FORBIDDEN" | "UNAUTHORIZED" | "INTERNAL_SERVER_ERROR";

/**
 * IntrospectionResponseInterface
 * AuthleteのイントロスペクションAPIの結果
 *
 * @author keita-nishimoto
 * @since 2016-01-25
 */
export interface IntrospectionResponseInterface {
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
  action: Actions;

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
  scopes?: [string];

  /**
   * アクセストークンに紐付いているユーザーの識別子
   * クライアントクレデンシャル等、アクセストークンにユーザーが紐付かない場合はこの値は設定されない
   */
  subject?: string;
}
