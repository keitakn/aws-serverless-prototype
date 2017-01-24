import {IntrospectionResponseInterface} from "./introspection-response-interface";

/**
 * AccessTokenEntityInterface
 *
 * @author keita-nishimoto
 * @since 2016-01-23
 */
interface AccessTokenEntityInterface {
  token: string;
  introspectionResponse: IntrospectionResponseInterface;
  extractHttpStats(): string;
}

/**
 * AccessTokenEntity
 *
 * @author keita-nishimoto
 * @since 2016-01-23
 */
export class AccessTokenEntity implements AccessTokenEntityInterface {
  /**
   * constructor
   *
   * @param _token
   * @param _introspectionResponse
   */
  constructor(
    private _token: string,
    private _introspectionResponse: IntrospectionResponseInterface
  ) {
  }

  /**
   * @returns {string}
   */
  get token(): string {
    return this._token;
  }

  /**
   * @returns {IntrospectionResponseInterface}
   */
  get introspectionResponse(): IntrospectionResponseInterface {
    return this._introspectionResponse;
  }

  /**
   * AuthleteのイントロスペクションAPI.actionから返却すべきHTTPステータスコードを取り出す
   *
   * @returns {string}
   */
  extractHttpStats(): string {
    return this._introspectionResponse.action;
  }
}
