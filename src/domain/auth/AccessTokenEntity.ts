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
  tokenResponse: AuthleteResponse.TokenResponse;
  extractHttpStats(): string;
  extractTokenAction(): string;
}

/**
 * AccessTokenEntity
 *
 * @author keita-nishimoto
 * @since 2017-01-23
 * @todo Authleteのレスポンスは書き換えられたくないのでもっと良い実装がないか検討 @keita-nishimoto
 */
export default class AccessTokenEntity implements AccessTokenEntityInterface {

  /**
   * /auth/token APIのレスポンス
   */
  private _tokenResponse: AuthleteResponse.TokenResponse;

  /**
   * AuthleteのイントロスペクションAPIのレスポンス
   */
  private _introspectionResponse: AuthleteResponse.IntrospectionResponse;

  /**
   * constructor
   *
   * @param _token
   */
  constructor(private _token: string) {
  }

  /**
   * @returns {string}
   */
  get token(): string {
    return this._token;
  }

  /**
   * @param value
   */
  set introspectionResponse(value: AuthleteResponse.IntrospectionResponse) {
    this._introspectionResponse = value;
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
