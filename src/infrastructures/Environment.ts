import {LambdaExecutionEvent} from "../../types";

/**
 * Environment
 *
 * @author keita-nishimoto
 * @since 2017-02-01
 */
export default class Environment {

  /**
   * constructor
   */
  constructor(private _event: LambdaExecutionEvent) {
  }

  /**
   * @returns {LambdaExecutionEvent}
   */
  get event(): LambdaExecutionEvent {
    return this._event;
  }

  /**
   * ローカル環境かどうかを判定する
   *
   * @param event
   * @returns {boolean}
   */
  isLocal(): boolean {

    if (this.event.headers.host === "localhost:8000") {
      return true;
    }

    return false;
  }
}
