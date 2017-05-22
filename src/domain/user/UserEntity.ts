import PasswordHash from "../auth/PasswordHash";

/**
 * UserEntity
 *
 * @author keita-nishimoto
 * @since 2017-03-22
 */
export namespace UserEntity {

  /**
   * Builder
   *
   * @author keita-nishimoto
   * @since 2017-03-22
   */
  export class Builder {
    /**
     * ユーザーID
     */
    private _subject: string;

    /**
     * メールアドレス
     */
    private _email: string;

    /**
     * メールアドレス検証済ステータス
     */
    private _emailVerified: number;

    /**
     * パスワードハッシュ値
     */
    private _passwordHash: PasswordHash;

    /**
     * 名前
     */
    private _name: string;

    /**
     * 性別
     */
    private _gender: string;

    /**
     * 誕生日
     */
    private _birthdate: string;

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
     * @returns {string}
     */
    get email(): string {
      return this._email;
    }

    /**
     * @param value
     */
    set email(value: string) {
      this._email = value;
    }

    /**
     * @returns {number}
     */
    get emailVerified(): number {
      return this._emailVerified;
    }

    /**
     * @param value
     */
    set emailVerified(value: number) {
      this._emailVerified = value;
    }

    /**
     * @returns {PasswordHash}
     */
    get passwordHash(): PasswordHash {
      return this._passwordHash;
    }

    /**
     * @param value
     */
    set passwordHash(value: PasswordHash) {
      this._passwordHash = value;
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
    get gender(): string {
      return this._gender;
    }

    /**
     * @param value
     */
    set gender(value: string) {
      this._gender = value;
    }

    /**
     * @returns {string}
     */
    get birthdate(): string {
      return this._birthdate;
    }

    /**
     * @param value
     */
    set birthdate(value: string) {
      this._birthdate = value;
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
     * @returns {UserEntity.Entity}
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
     * ユーザーID
     */
    private _subject: string;

    /**
     * メールアドレス
     */
    private _email: string;

    /**
     * メールアドレス検証済ステータス
     */
    private _emailVerified: number;

    /**
     * パスワードハッシュ値
     */
    private _passwordHash: PasswordHash;

    /**
     * 名前
     */
    private _name: string;

    /**
     * 性別
     */
    private _gender: string;

    /**
     * 誕生日
     */
    private _birthdate: string;

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
      this._subject       = builder.subject;
      this._email         = builder.email;
      this._emailVerified = builder.emailVerified;
      this._passwordHash  = builder.passwordHash;
      this._name          = builder.name;
      this._gender        = builder.gender;
      this._birthdate     = builder.birthdate;
      this._createdAt     = builder.createdAt;
      this._updatedAt     = builder.updatedAt;
    }

    /**
     * @returns {string}
     */
    get subject(): string {
      return this._subject;
    }

    /**
     * @returns {string}
     */
    get email(): string {
      return this._email;
    }

    /**
     * @returns {number}
     */
    get emailVerified(): number {
      return this._emailVerified;
    }

    /**
     * @returns {PasswordHash}
     */
    get passwordHash(): PasswordHash {
      return this._passwordHash;
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
    get gender(): string {
      return this._gender;
    }

    /**
     * @returns {string}
     */
    get birthdate(): string {
      return this._birthdate;
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
    get updatedAt(): number {
      return this._updatedAt;
    }

    /**
     * パスワードを検証する
     *
     * @param passwordHash
     * @returns {boolean}
     */
    public verifyPassword(passwordHash: PasswordHash) {
      const userPasswordHash = this.passwordHash.passwordHash;

      if (userPasswordHash === passwordHash.passwordHash) {
        return true;
      }

      return false;
    }
  }
}
