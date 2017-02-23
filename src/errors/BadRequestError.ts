/**
 * 400 Bad Request
 * リクエストが不正な場合に利用する。
 *
 * @author keita-nishimoto
 * @since 2017-02-22
 */
export default class BadRequestError extends Error {
  /**
   * constructor
   *
   * @param message
   */
  constructor(message: string = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}
