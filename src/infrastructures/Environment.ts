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

  /**
   * 実行環境を取得する
   *
   * @returns {string}
   */
  getStage(): string {
    return this.event.requestContext.stage;
  }

  /**
   * 実行環境のUsersテーブル名を取得する
   *
   * @returns {any}
   */
  getUsersTableName(): string {
    return process.env.USERS_TABLE_NAME;
  }
}
