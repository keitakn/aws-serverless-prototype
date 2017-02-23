/**
 * ClientEntityInterface
 *
 * @author keita-nishimoto
 * @since 2017-01-16
 */
interface ClientEntityInterface {
  id: number;
  secret: string;
  name: string;
  developer: string;
  applicationType: string;
  redirectUris: [string];
  grantTypes: [string];
  scopes: [string];
  createdAt: number;
  updatedAt: number;
}

/**
 * ClientEntity
 *
 * @author keita-nishimoto
 * @since 2017-01-16
 */
export default class ClientEntity implements ClientEntityInterface {

  /**
   * クライアントシークレット
   */
  private _secret: string;

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
  private _applicationType: string;

  /**
   * リダイレクトURI
   */
  private _redirectUris: [string];

  /**
   * クライアントタイプ
   */
  private _grantTypes: [string];

  /**
   * スコープ
   */
  private _scopes: [string];

  /**
   * 更新日時
   */
  private _updatedAt: number;

  /**
   * constructor
   *
   * @param _id
   * @param _createdAt
   */
  constructor(private _id: number, private _createdAt: number) {
  }

  /**
   * @returns {number}
   */
  get id(): number {
    return this._id;
  }

  /**
   * @returns {number}
   */
  get createdAt(): number {
    return this._createdAt;
  }

  /**
   * @returns {string}
   */
  get secret(): string {
    return this._secret;
  }

  /**
   * @param value
   */
  set secret(value: string) {
    this._secret = value;
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
   * @returns {string}
   */
  get applicationType(): string {
    return this._applicationType;
  }

  /**
   * @param value
   */
  set applicationType(value: string) {
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
   * @returns {[string]}
   */
  get grantTypes(): [string] {
    return this._grantTypes;
  }

  /**
   * @param value
   */
  set grantTypes(value: [string]) {
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
  get updatedAt(): number {
    return this._updatedAt;
  }

  /**
   * @param value
   */
  set updatedAt(value: number) {
    this._updatedAt = value;
  }
}
