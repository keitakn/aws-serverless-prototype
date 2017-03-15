import {LambdaEvent} from "../types/aws/types";

/**
 * RequestFactory
 * AWSLambdaEventオブジェクトからリクエストオブジェクトを生成する
 *
 * @author keita-nishimoto
 * @since 2016-03-15
 */
export class RequestFactory {

  /**
   * constructor
   *
   * @param _event
   * @param _isLocal
   */
  constructor(private _event: LambdaEvent, private _isLocal: boolean = false) {
  }

  /**
   * @returns {LambdaEvent}
   */
  get event(): LambdaEvent {
    return this._event;
  }

  /**
   * @returns {boolean}
   */
  get isLocal(): boolean {
    return this._isLocal;
  }

  /**
   * リクエストオブジェクトを生成する
   *
   * @returns {any}
   */
  create(): any {
    let request;

    const eventBody: any = this.event.body;
    request = eventBody;

    if (this.isLocal === false) {
      request = JSON.parse(eventBody);
    }

    return request;
  }
}
