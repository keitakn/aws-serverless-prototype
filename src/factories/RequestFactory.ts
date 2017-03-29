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
   */
  constructor(private _event: LambdaEvent) {
  }

  /**
   * @returns {LambdaEvent}
   */
  get event(): LambdaEvent {
    return this._event;
  }

  /**
   * リクエストオブジェクトを生成する
   *
   * @returns {any}
   */
  create(): any {
    const eventBody: any = this.event.body;

    return JSON.parse(eventBody);
  }
}
