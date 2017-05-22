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
   * @param isConvertJson
   * @returns {{statusCode: number, headers: Object, body: Object}}
   */
  getResponse(isConvertJson: boolean = true) {

    let responseBody = this.responseBody;
    if (isConvertJson === true) {
      responseBody = JSON.stringify(this.responseBody);
    }

    const response = {
      statusCode: this.statusCode,
      headers: this.headers,
      body: responseBody,
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
