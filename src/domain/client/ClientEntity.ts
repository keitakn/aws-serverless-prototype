import {AuthleteAPI} from "../../types/authlete/types";

/**
 * ClientEntity
 *
 * @author keita-nishimoto
 * @since 2017-03-22
 */
export namespace ClientEntity {

  /**
   * Builder
   *
   * @author keita-nishimoto
   * @since 2017-03-22
   */
  export class Builder {
    /**
     * クライントID
     */
    private _clientId: number;

    /**
     * クライアントシークレット
     */
    private _clientSecret: string;

    /**
     * クライアント名
     */
    private _name: string;

    /**
     * 開発者
     */
    private _developer: string;

    /**
     * アプリケーションタイプ
     */
    private _applicationType: AuthleteAPI.ApplicationTypes;

    /**
     * リダイレクトURI
     */
    private _redirectUris: [string];

    /**
     * クライアントタイプ
     */
    private _grantTypes: [AuthleteAPI.GrantTypes];

    /**
     * スコープ
     */
    private _scopes: [string];

    /**
     * 作成日時
     */
    private _createdAt: number;

    /**
     * 更新日時
     */
    private _updatedAt: number;

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
    get clientSecret(): string {
      return this._clientSecret;
    }

    /**
     * @param value
     */
    set clientSecret(value: string) {
      this._clientSecret = value;
    }

    /**
     * @returns {string}
     */
    get name(): string {
      return this._name;
    }

    /**
     * @param value
     */
    set name(value: string) {
      this._name = value;
    }

    /**
     * @returns {string}
     */
    get developer(): string {
      return this._developer;
    }

    /**
     * @param value
     */
    set developer(value: string) {
      this._developer = value;
    }

    /**
     * @returns {AuthleteAPI.ApplicationTypes}
     */
    get applicationType(): AuthleteAPI.ApplicationTypes {
      return this._applicationType;
    }

    /**
     * @param value
     */
    set applicationType(value: AuthleteAPI.ApplicationTypes) {
      this._applicationType = value;
    }

    /**
     * @returns {[string]}
     */
    get redirectUris(): [string] {
      return this._redirectUris;
    }

    /**
     * @param value
     */
    set redirectUris(value: [string]) {
      this._redirectUris = value;
    }

    /**
     * @returns {[AuthleteAPI.GrantTypes]}
     */
    get grantTypes(): [AuthleteAPI.GrantTypes] {
      return this._grantTypes;
    }

    /**
     * @param value
     */
    set grantTypes(value: [AuthleteAPI.GrantTypes]) {
      this._grantTypes = value;
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
     * @returns {number}
     */
    get createdAt(): number {
      return this._createdAt;
    }

    /**
     * @param value
     */
    set createdAt(value: number) {
      this._createdAt = value;
    }

    /**
     * @returns {number}
     */
    get updatedAt(): number {
      return this._updatedAt;
    }

    /**
     * @param value
     */
    set updatedAt(value: number) {
      this._updatedAt = value;
    }

    /**
     * @returns {ClientEntity.Entity}
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
     * クライントID
     */
    private _clientId: number;

    /**
     * クライアントシークレット
     */
    private _clientSecret: string;

    /**
     * クライアント名
     */
    private _name: string;

    /**
     * 開発者
     */
    private _developer: string;

    /**
     * アプリケーションタイプ
     */
    private _applicationType: AuthleteAPI.ApplicationTypes;

    /**
     * リダイレクトURI
     */
    private _redirectUris: [string];

    /**
     * クライアントタイプ
     */
    private _grantTypes: [AuthleteAPI.GrantTypes];

    /**
     * スコープ
     */
    private _scopes: [string];

    /**
     * 作成日時
     */
    private _createdAt: number;

    /**
     * 更新日時
     */
    private _updatedAt: number;

    /**
     * constructor
     *
     * @param builder
     */
    constructor(builder: Builder) {
      this._clientId        = builder.clientId;
      this._clientSecret    = builder.clientSecret;
      this._name            = builder.name;
      this._developer       = builder.developer;
      this._applicationType = builder.applicationType;
      this._redirectUris    = builder.redirectUris;
      this._grantTypes      = builder.grantTypes;
      this._scopes          = builder.scopes;
      this._createdAt       = builder.createdAt;
      this._updatedAt       = builder.updatedAt;
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
    get clientSecret(): string {
      return this._clientSecret;
    }

    /**
     * @returns {string}
     */
    get name(): string {
      return this._name;
    }

    /**
     * @returns {string}
     */
    get developer(): string {
      return this._developer;
    }

    /**
     * @returns {AuthleteAPI.ApplicationTypes}
     */
    get applicationType(): AuthleteAPI.ApplicationTypes {
      return this._applicationType;
    }

    /**
     * @returns {[string]}
     */
    get redirectUris(): [string] {
      return this._redirectUris;
    }

    /**
     * @returns {[AuthleteAPI.GrantTypes]}
     */
    get grantTypes(): [AuthleteAPI.GrantTypes] {
      return this._grantTypes;
    }

    /**
     * @returns {[string]}
     */
    get scopes(): [string] {
      return this._scopes;
    }

    /**
     * @returns {number}
     */
    get createdAt(): number {
      return this._createdAt;
    }

    /**
     * @returns {number}
     */
    get updatedAt(): number {
      return this._updatedAt;
    }
  }
}
