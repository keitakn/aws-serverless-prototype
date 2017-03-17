import {LambdaEvent} from "../types/aws/types";

/**
 * Environment
 *
 * @author keita-nishimoto
 * @since 2017-02-01
 */
export default class Environment<T extends LambdaEvent> {

  /**
   * constructor
   */
  constructor(private _event: T) {
  }

  /**
   * @returns {T}
   */
  get event(): T {
    return this._event;
  }

  /**
   * ローカル環境かどうかを判定する
   *
   * @param event
   * @returns {boolean}
   */
  isLocal(): boolean {

    if (process.env.IS_OFFLINE) {
      return true;
    }

    return false;
  }
}
