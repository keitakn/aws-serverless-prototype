/**
 * PasswordHash
 *
 * @author keita-nishimoto
 * @since 2016-02-06
 */
export default class PasswordHash {

  /**
   * constructor
   *
   * @param _passwordHash
   * @param _password
   */
  constructor(private _passwordHash: string, private _password?: string) {
  }

  /**
   * @returns {string}
   */
  get passwordHash(): string {
    return this._passwordHash;
  }

  /**
   * @returns {string}
   */
  get password(): string {
    return this._password;
  }
}
