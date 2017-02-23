/**
 * SuccessResponse
 *
 * @author keita-nishimoto
 * @since 2017-02-23
 */
export class SuccessResponse {

  /**
   * constructor
   *
   * @param _responseBody
   * @param _statusCode
   * @param _headers
   */
  constructor(
    private _responseBody: Object,
    private _statusCode: number = 200,
    private _headers: Object = {"Access-Control-Allow-Origin": "*"}) {
  }

  /**
   * レスポンスを取得する
   *
   * @returns {{statusCode: number, headers: Object, body: string}}
   */
  getResponse() {
    const response = {
      statusCode: this.statusCode,
      headers: this.headers,
      body: JSON.stringify(this.responseBody)
    };

    return response;
  }

  /**
   * @returns {Object}
   */
  get responseBody(): Object {
    return this._responseBody;
  }

  /**
   * @returns {number}
   */
  get statusCode(): number {
    return this._statusCode;
  }

  /**
   * @returns {Object}
   */
  get headers(): Object {
    return this._headers;
  }
}
