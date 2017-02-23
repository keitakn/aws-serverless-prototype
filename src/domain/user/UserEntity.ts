import PasswordHash from "../auth/PasswordHash";

/**
 * UserEntityInterface
 *
 * @author keita-nishimoto
 * @since 2017-01-17
 */
interface UserEntityInterface {
  id: string;
  email: string;
  emailVerified: number;
  passwordHash: PasswordHash;
  name: string;
  gender: string;
  birthdate: string;
  updatedAt: number;
}

/**
 * UserEntity
 *
 * @author keita-nishimoto
 * @since 2017-01-17
 */
export default class UserEntity implements UserEntityInterface {

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
   * @returns {string}
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
   * パスワードを検証する
   *
   * @param passwordHash
   * @returns {boolean}
   */
  verifyPassword(passwordHash: PasswordHash) {
    const userPasswordHash = this.passwordHash.passwordHash;

    if (userPasswordHash === passwordHash.passwordHash) {
      return true;
    }

    return false;
  }
}
