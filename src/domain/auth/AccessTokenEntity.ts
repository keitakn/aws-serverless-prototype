import {AuthleteAPI} from "../../types/authlete/types";

/**
 * AccessTokenEntityInterface
 *
 * @author keita-nishimoto
 * @since 2017-01-23
 */
interface AccessTokenEntityInterface {
  token: string;
  introspectionResponse: AuthleteAPI.IntrospectionResponse;
  tokenResponse: AuthleteAPI.TokenResponse;
  extractIntrospectionAction(): string;
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
  private _tokenResponse: AuthleteAPI.TokenResponse;

  /**
   * AuthleteのイントロスペクションAPIのレスポンス
   */
  private _introspectionResponse: AuthleteAPI.IntrospectionResponse;

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
  set introspectionResponse(value: AuthleteAPI.IntrospectionResponse) {
    this._introspectionResponse = value;
  }

  /**
   * @returns {AuthleteAPI.IntrospectionResponse}
   */
  get introspectionResponse(): AuthleteAPI.IntrospectionResponse {
    return this._introspectionResponse;
  }

  /**
   * @returns {AuthleteAPI.TokenResponse}
   */
  get tokenResponse(): AuthleteAPI.TokenResponse {
    return this._tokenResponse;
  }

  /**
   * @param value
   */
  set tokenResponse(value: AuthleteAPI.TokenResponse) {
    this._tokenResponse = value;
  }

  /**
   * AuthleteのイントロスペクションAPI.actionから返却すべきHTTPステータスコードを取り出す
   *
   * @returns {AuthleteAPI.IntrospectionActions}
   */
  extractIntrospectionAction(): AuthleteAPI.IntrospectionActions {
    return this._introspectionResponse.action;
  }

  /**
   * トークン発行時にクライアントに返すべきアクションを取り出す
   *
   * @returns {AuthleteAPI.TokenResponseActions}
   */
  extractTokenAction(): AuthleteAPI.TokenResponseActions {
    return this.tokenResponse.action;
  }
}
