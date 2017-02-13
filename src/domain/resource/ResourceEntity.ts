/**
 * ResourceEntityInterface
 *
 * @author keita-nishimoto
 * @since 2016-02-13
 */
interface ResourceEntityInterface {
  id: string;
  httpMethod: string;
  resourcePath: string;
  name: string;
  scopes: [string];
  createdAt: number;
  updatedAt: number;
}

/**
 * ResourceEntity
 *
 * @author keita-nishimoto
 * @since 2016-02-13
 */
export class ResourceEntity implements ResourceEntityInterface {

  /**
   * HTTPメソッド
   */
  private _httpMethod: string;

  /**
   * リソースパス
   */
  private _resourcePath: string;

  /**
   * リソース名
   */
  private _name: string;

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
   * @param id
   * @param createdAt
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
  get httpMethod(): string {
    return this._httpMethod;
  }

  /**
   * @param value
   */
  set httpMethod(value: string) {
    this._httpMethod = value;
  }

  /**
   * @returns {string}
   */
  get resourcePath(): string {
    return this._resourcePath;
  }

  /**
   * @param value
   */
  set resourcePath(value: string) {
    this._resourcePath = value;
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
