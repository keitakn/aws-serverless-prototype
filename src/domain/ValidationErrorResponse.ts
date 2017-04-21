/**
 * ValidationErrorResponse
 *
 * @author keita-nishimoto
 * @since 2017-03-10
 */
export class ValidationErrorResponse {

  /**
   * constructor
   *
   * @param _validateResultObject
   */
  constructor(private _validateResultObject: Object) {
  }

  /**
   * @returns {Object}
   */
  get validateResultObject(): Object {
    return this._validateResultObject;
  }

  /**
   * レスポンスを取得する
   *
   * @returns {{statusCode: number, headers: {Access-Control-Allow-Origin: string}, body: string}}
   */
  public getResponse(): Object {
    const responseCode = 422;

    const responseBody = {
      code: responseCode,
      message: "Unprocessable Entity",
      errors: this.validateResultObject
    };

    return {
      statusCode: responseCode,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(responseBody)
    };
  }
}
