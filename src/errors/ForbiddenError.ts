/**
 * 403 Forbidden
 * リソースにアクセスすることを禁止されている場合に利用する。
 *
 * @author keita-nishimoto
 * @since 2017-02-22
 */
export default class ForbiddenError extends Error {
  /**
   * constructor
   *
   * @param message
   */
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
