import {LambdaExecutionEvent} from "../../types";

/**
 * Environment
 *
 * @author keita-nishimoto
 * @since 2016-02-01
 */
export default class Environment {

  /**
   * constructor
   */
  constructor(private event: LambdaExecutionEvent) {
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
