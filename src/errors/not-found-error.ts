/**
 * 404 Not Found Error
 *
 * @author keita-nishimoto
 * @since 2016-01-18
 */
export class NotFoundError extends Error {

  /**
   * エラーコード
   */
  private _errorCode: number;

  /**
   * エラーメッセージ
   */
  private _errorMessage: string;

  /**
   * constructor
   *
   * @param errorCode
   * @param errorMessage
   */
  constructor(errorCode: number = 404, errorMessage: string = "Not Found") {
    super(errorMessage);
  }

  /**
   * @returns {number}
   */
  get errorCode(): number {
    return this._errorCode;
  }

  /**
   * @returns {string}
   */
  get errorMessage(): string {
    return this._errorMessage;
  }
}
