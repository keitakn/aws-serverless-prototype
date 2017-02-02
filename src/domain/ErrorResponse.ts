/**
 * ErrorResponse
 *
 * @author keita-nishimoto
 * @since 2016-01-19
 */
export default class ErrorResponse {

  /**
   * エラーレスポンスに必要な定数
   *
   * @type {{NotFoundError: {statusCode: number; errorCode: number}}}
   * @private
   * @todo ここにハードコードするのはイケてないので何らかの対策を考える @keita-nishimoto
   */
  private _errorConstant: any = {
    "NotFoundError": {
      "statusCode": 404,
      "errorCode": 404
    }
  };

  /**
   * HTTPステータスコード
   */
  private _statusCode: number;

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
   * @param _error
   */
  constructor(private _error: Error) {
    for (const key of Object.keys(this.errorConstant)) {
      if (key === this.error.name) {
        this.createResponse();
      }
    }
  }

  /**
   * @returns {Error}
   */
  get error(): Error {
    return this._error;
  }

  /**
   * @returns {any}
   */
  get errorConstant(): any {
    return this._errorConstant;
  }

  /**
   * @returns {number}
   */
  get statusCode(): number {
    return this._statusCode;
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

  /**
   * レスポンスを取得する
   *
   * @returns {{statusCode: number, headers: {Access-Control-Allow-Origin: string}, body: string}}
   */
  getResponse(): any {
    // このメソッドでObjectを整形して返すよりも呼出元でこのObjectを作ったほうが良いかも
    const responseBody = {
      "code": this.errorCode,
      "message": `${this.errorMessage}`
    };

    const response = {
      statusCode: this.statusCode,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(responseBody)
    };

    return response;
  }

  /**
   * レスポンスを生成する
   */
  private createResponse() {
    // TODO 想定外のErrorが渡ってきた時の考慮が必要 @keita-nishimoto
    const errorClassName = this.error.name;

    this._statusCode = this.errorConstant[errorClassName]["statusCode"];
    this._errorCode = this.errorConstant[errorClassName]["errorCode"];
    this._errorMessage = this.error.message;
  }
}
