/**
 * ResourceEntity
 *
 * @author keita-nishimoto
 * @since 2017-03-22
 */
export namespace ResourceEntity {

  /**
   * Builder
   *
   * @author keita-nishimoto
   * @since 2017-03-22
   */
  export class Builder {
    /**
     * リソースID
     * HTTPメソッドとリソースパスを組み合わせて作成する
     */
    private _resourceId: string;

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
     * 作成日時
     */
    private _createdAt: number;

    /**
     * 更新日時
     */
    private _updatedAt: number;

    /**
     * @returns {string}
     */
    get resourceId(): string {
      return this._resourceId;
    }

    /**
     * @param value
     */
    set resourceId(value: string) {
      this._resourceId = value;
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
     * @returns {ResourceEntity.Entity}
     */
    public build(): Entity {
      return new Entity(this);
    }
  }

  /**
   * Entity
   *
   * @author keita-nishimoto
   * @since 2017-02-13
   */
  export class Entity {

    /**
     * リソースID
     * HTTPメソッドとリソースパスを組み合わせて作成する
     */
    private _resourceId: string;

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
      this._resourceId   = builder.resourceId;
      this._httpMethod   = builder.httpMethod;
      this._resourcePath = builder.resourcePath;
      this._name         = builder.name;
      this._scopes       = builder.scopes;
      this._createdAt    = builder.createdAt;
      this._updatedAt    = builder.updatedAt;
    }

    /**
     * @returns {string}
     */
    get resourceId(): string {
      return this._resourceId;
    }

    /**
     * @returns {string}
     */
    get httpMethod(): string {
      return this._httpMethod;
    }

    /**
     * @returns {string}
     */
    get resourcePath(): string {
      return this._resourcePath;
    }

    /**
     * @returns {string}
     */
    get name(): string {
      return this._name;
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
