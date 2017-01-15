/**
 * ClientEntityInterface
 *
 * @author keita-nishimoto
 * @since 2016-01-16
 */
interface ClientEntityInterface {
  id: string,
  secret: string,
  name: string,
  redirectUri: string,
  createdAt: number,
  updatedAt: number
}

/**
 * ClientEntity
 *
 * @author keita-nishimoto
 * @since 2016-01-16
 */
export class ClientEntity implements ClientEntityInterface {

  /**
   * クライアントシークレット
   */
  private _secret: string;

  /**
   * クライアント名
   */
  private _name: string;

  /**
   * リダイレクトURI
   */
  private _redirectUri: string;

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
  constructor(private _id: string, private _createdAt: number) {
  }

  /**
   * @returns {string}
   */
  get id(): string {
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
