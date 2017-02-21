/**
 * ClientRequest
 * クライアント系APIのリクエストオブジェクト
 *
 * @author keita-nishimoto
 * @since 2016-02-20
 */
export namespace ClientRequest {

  // TODO 独自定義した型定義はどこかにまとめたい。 @keita-koga

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
   * クライアント作成のリクエストオブジェクト
   *
   * @author keita-nishimoto
   * @since 2016-02-20
   */
  export class CreateClientRequest {
    constructor(
      private _developer: string,
      private _applicationType: ApplicationType,
      private _clientType: ClientType,
      private _redirectUris: [string],
      private _responseTypes: [ResponseType],
      private _grantTypes: [GrantType],
      private _scopes: [string]
    ) {
    }

    /**
     * @returns {string}
     */
    get developer(): string {
      return this._developer;
    }

    /**
     * @returns {ApplicationType}
     */
    get applicationType(): ApplicationType {
      return this._applicationType;
    }

    /**
     * @returns {ClientType}
     */
    get clientType(): ClientType {
      return this._clientType;
    }

    /**
     * @returns {[string]}
     */
    get redirectUris(): [string] {
      return this._redirectUris;
    }

    /**
     * @returns {[ResponseType]}
     */
    get responseTypes(): [ResponseType] {
      return this._responseTypes;
    }

    /**
     * @returns {[GrantType]}
     */
    get grantTypes(): [GrantType] {
      return this._grantTypes;
    }

    /**
     * @returns {[string]}
     */
    get scopes(): [string] {
      return this._scopes;
    }
  }
}
