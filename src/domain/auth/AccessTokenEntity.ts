import {AuthleteAPI} from "../../types/authlete/types";

/**
 * AccessTokenEntity
 *
 * @author keita-nishimoto
 * @since 2017-03-22
 */
export namespace AccessTokenEntity {

  /**
   * Builder
   *
   * @author keita-nishimoto
   * @since 2017-03-22
   */
  export class Builder {
    /**
     * アクセストークン
     */
    private _accessToken: string;

    /**
     * /auth/token APIのレスポンス
     */
    private _tokenResponse: AuthleteAPI.TokenResponse;

    /**
     * AuthleteのイントロスペクションAPIのレスポンス
     */
    private _introspectionResponse: AuthleteAPI.IntrospectionResponse;

    /**
     * @returns {string}
     */
    get accessToken(): string {
      return this._accessToken;
    }

    /**
     * @param value
     */
    set accessToken(value: string) {
      this._accessToken = value;
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
     * @returns {AuthleteAPI.IntrospectionResponse}
     */
    get introspectionResponse(): AuthleteAPI.IntrospectionResponse {
      return this._introspectionResponse;
    }

    /**
     * @param value
     */
    set introspectionResponse(value: AuthleteAPI.IntrospectionResponse) {
      this._introspectionResponse = value;
    }

    /**
     * @returns {AccessTokenEntity.Entity}
     */
    public build(): Entity {
      return new Entity(this);
    }
  }

  /**
   * Entity
   *
   * @author keita-nishimoto
   * @since 2017-03-22
   */
  export class Entity {
    /**
     * アクセストークン
     */
    private _accessToken: string;

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
     * @param builder
     */
    constructor(builder: Builder) {
      this._accessToken           = builder.accessToken;
      this._introspectionResponse = builder.introspectionResponse;
      this._tokenResponse         = builder.tokenResponse;
    }

    /**
     * @returns {string}
     */
    get accessToken(): string {
      return this._accessToken;
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
     * AuthleteのイントロスペクションAPI.actionから返却すべきHTTPステータスコードを取り出す
     *
     * @returns {AuthleteAPI.IntrospectionActions}
     */
    public extractIntrospectionAction(): AuthleteAPI.IntrospectionActions {
      return this.introspectionResponse.action;
    }

    /**
     * トークン発行時にクライアントに返すべきアクションを取り出す
     *
     * @returns {AuthleteAPI.TokenResponseActions}
     */
    public extractTokenAction(): AuthleteAPI.TokenResponseActions {
      return this.tokenResponse.action;
    }
  }
}
