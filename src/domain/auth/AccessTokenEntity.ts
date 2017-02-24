import {AuthleteResponse} from "./AuthleteResponse";

/**
 * AccessTokenEntityInterface
 *
 * @author keita-nishimoto
 * @since 2017-01-23
 */
interface AccessTokenEntityInterface {
  token: string;
  introspectionResponse: AuthleteResponse.IntrospectionResponse;
  isAllowed: boolean;
  extractHttpStats(): string;
}

/**
 * AccessTokenEntity
 *
 * @author keita-nishimoto
 * @since 2017-01-23
 * @todo Genericsを使った形にリファクタリングする。 @keita-koga
 */
export default class AccessTokenEntity implements AccessTokenEntityInterface {

  /**
   * /auth/token APIのレスポンス
   */
  private _tokenResponse: AuthleteResponse.TokenResponse;

  /**
   * constructor
   *
   * @param _token
   * @param _introspectionResponse
   * @param _isAllowed
   */
  constructor(
    private _token: string,
    private _introspectionResponse?: AuthleteResponse.IntrospectionResponse,
    private _isAllowed: boolean = false
  ) {
  }

  /**
   * @returns {string}
   */
  get token(): string {
    return this._token;
  }

  /**
   * @returns {AuthleteResponse.IntrospectionResponse}
   */
  get introspectionResponse(): AuthleteResponse.IntrospectionResponse {
    return this._introspectionResponse;
  }

  /**
   * @returns {AuthleteResponse.TokenResponse}
   */
  get tokenResponse(): AuthleteResponse.TokenResponse {
    return this._tokenResponse;
  }

  /**
   * @param value
   */
  set tokenResponse(value: AuthleteResponse.TokenResponse) {
    this._tokenResponse = value;
  }

  /**
   * @returns {boolean}
   */
  get isAllowed(): boolean {
    return this._isAllowed;
  }

  /**
   * @param value
   */
  set isAllowed(value: boolean) {
    this._isAllowed = value;
  }

  /**
   * AuthleteのイントロスペクションAPI.actionから返却すべきHTTPステータスコードを取り出す
   *
   * @returns {string}
   */
  extractHttpStats(): string {
    return this._introspectionResponse.action;
  }

  /**
   * トークン発行時にクライアントに返すべきアクションを取り出す
   *
   * @returns {TokenResponseActions}
   */
  extractTokenAction(): string {
    return this.tokenResponse.action;
  }
}
