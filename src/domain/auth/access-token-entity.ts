/**
 * AccessTokenEntityInterface
 *
 * @author keita-nishimoto
 * @since 2016-01-23
 */
interface AccessTokenEntityInterface {
  token: string;
  clientId: number;
  sub: string;
}

/**
 * AccessTokenEntity
 *
 * @author keita-nishimoto
 * @since 2016-01-23
 */
export class AccessTokenEntity implements AccessTokenEntityInterface {

  /**
   * constructor
   *
   * @param _token
   * @param _clientId
   * @param _sub
   */
  constructor(private _token: string, private _clientId: number, private _sub: string) {
  }

  /**
   * @returns {string}
   */
  get token(): string {
    return this._token;
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
  get sub(): string {
    return this._sub;
  }
}
