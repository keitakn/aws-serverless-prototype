import * as lambda from "aws-lambda";
import {isUndefined} from "util";

/**
 * ErrorResponse
 *
 * @author keita-nishimoto
 * @since 2017-01-19
 */
export default class ErrorResponse {

  /**
   * エラーレスポンスに必要な定数
   *
   * @private
   */
  private _errorConstant: any = {
    NotFoundError: {
      statusCode: 404,
      errorCode: 404,
    },
    UnauthorizedError: {
      statusCode: 401,
      errorCode: 401,
    },
    BadRequestError: {
      statusCode: 400,
      errorCode: 400,
    },
    ForbiddenError: {
      statusCode: 403,
      errorCode: 403,
    },
    InternalServerError : {
      statusCode: 500,
      errorCode: 500,
    },
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
    this.setErrorInfo();
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
  public getResponse(): lambda.ProxyResult {
    // このメソッドでObjectを整形して返すよりも呼出元でこのObjectを作ったほうが良いかも
    const defaultStatusCode = 500;
    const defaultErrorCode  = defaultStatusCode;

    if (isUndefined(this.errorCode) === true) {
      this._errorCode = defaultErrorCode;
    }

    if (isUndefined(this.errorMessage) === true) {
      this._errorMessage = "Internal Server Error";
    }

    if (isUndefined(this.statusCode) === true) {
      this._statusCode = defaultStatusCode;
    }

    const responseBody = {
      code: this.errorCode,
      message: `${this.errorMessage}`,
    };

    const response = {
      statusCode: this.statusCode,
      headers: {
        "Access-Control-Allow-Origin" : "*",
      },
      body: JSON.stringify(responseBody),
    };

    return response;
  }

  /**
   * エラーをセットする
   */
  private setErrorInfo() {
    for (const key of Object.keys(this.errorConstant)) {
      if (isUndefined(this.error.name) === false) {
        if (key === this.error.name) {
          this.setBusinessLogicErrorInfo();
          return;
        }
      }
    }

    this.setUnexpectedErrorInfo();
  }

  /**
   * ビジネスロジックエラーをセットする
   */
  private setBusinessLogicErrorInfo() {
    const errorClassName = this.error.name;
    this._statusCode = this.errorConstant[errorClassName]["statusCode"];
    this._errorCode = this.errorConstant[errorClassName]["errorCode"];
    this._errorMessage = this.error.message;
  }

  /**
   * 予期せぬエラーをセットする
   */
  private setUnexpectedErrorInfo() {
    this._statusCode = 500;
    this._errorCode = 500;
    this._errorMessage = "Internal Server Error";
  }
}
