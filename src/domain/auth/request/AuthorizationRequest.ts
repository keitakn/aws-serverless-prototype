/**
 * AuthorizationRequest
 * 認可コード発行のリクエスト
 *
 * @author keita-nishimoto
 * @since 2017-02-21
 */
export namespace AuthorizationRequest {

  /**
   * RequestBuilder
   *
   * @author keita-nishimoto
   * @since 2017-02-21
   */
  export class RequestBuilder {

    /**
     * クライアントID
     */
    private _clientId: number;

    /**
     * OAuth2.0 state
     */
    private _state: string;

    /**
     * OAuth2.0 redirect_uri
     */
    private _redirectUri: string;

    /**
     * ユーザーの識別子
     */
    private _subject: string;

    /**
     * リクエストの際に要求するscope
     */
    private _scopes: [string];

    /**
     * constructor
     */
    constructor() {
    }

    /**
     * @returns {number}
     */
    get clientId(): number {
      return this._clientId;
    }

    /**
     * @param value
     */
    set clientId(value: number) {
      this._clientId = value;
    }

    /**
     * @returns {string}
     */
    get state(): string {
      return this._state;
    }

    /**
     * @param value
     */
    set state(value: string) {
      this._state = value;
    }

    /**
     * @returns {string}
     */
    get redirectUri(): string {
      return this._redirectUri;
    }

    /**
     * @param value
     */
    set redirectUri(value: string) {
      this._redirectUri = value;
    }

    /**
     * @returns {string}
     */
    get subject(): string {
      return this._subject;
    }

    /**
     * @param value
     */
    set subject(value: string) {
      this._subject = value;
    }

    /**
     * @returns {[string]}
     */
    get scopes(): [string] {
      return this._scopes;
    }

    /**
     * @param value
     */
    set scopes(value: [string]) {
      this._scopes = value;
    }

    /**
     * Requestを組み立てる
     *
     * @returns {AuthorizationRequest.Request}
     */
    build(): Request {
      return new Request(this);
    }
  }

  /**
   * Request
   * 認可コード発行のリクエスト
   *
   * @author keita-nishimoto
   * @since 2017-02-21
   */
  export class Request {

    /**
     * クライアントID
     */
    private _clientId: number;

    /**
     * OAuth2.0 state
     */
    private _state: string;

    /**
     * OAuth2.0 redirect_uri
     */
    private _redirectUri: string;

    /**
     * ユーザーの識別子
     */
    private _subject: string;

    /**
     * リクエストの際に要求するscope
     */
    private _scopes: [string];

    /**
     * constructor
     *
     * @param requestBuilder
     */
    constructor(requestBuilder: RequestBuilder) {
      this._clientId    = requestBuilder.clientId;
      this._state       = requestBuilder.state;
      this._redirectUri = requestBuilder.redirectUri;
      this._subject     = requestBuilder.subject;
      this._scopes      = requestBuilder.scopes;
    }

    /**
     * @returns {number}
     */
    get clientId(): number {
      return this._clientId;
    }

    /**
     * @returns {string}
     */
    get state(): string {
      return this._state;
    }

    /**
     * @returns {string}
     */
    get redirectUri(): string {
      return this._redirectUri;
    }

    /**
     * @returns {string}
     */
    get subject(): string {
      return this._subject;
    }

    /**
     * @returns {[string]}
     */
    get scopes(): [string] {
      return this._scopes;
    }
  }
}


