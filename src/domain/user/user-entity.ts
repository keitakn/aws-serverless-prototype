/**
 * UserEntityInterface
 *
 * @author keita-nishimoto
 * @since 2016-01-17
 */
interface UserEntityInterface {
  id: string
  email: string
  name: string
  gender: string
  birthdate: string
}

/**
 * UserEntity
 *
 * @author keita-nishimoto
 * @since 2016-01-17
 */
export class UserEntity implements UserEntityInterface {

  /**
   * メールアドレス
   */
  private _email: string;

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
}
