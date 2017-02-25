/**
 * PasswordHash
 *
 * @author keita-nishimoto
 * @since 2017-02-06
 */
export default class PasswordHash {

  /**
   * constructor
   *
   * @param _passwordHash
   * @param _password
   */
  constructor(private _passwordHash: string, private _password?: string|null) {
  }

  /**
   * @returns {string}
   */
  get passwordHash(): string {
    return this._passwordHash;
  }

  /**
   * @returns {string|null}
   */
  get password(): string|any {
    return this._password;
  }
}
