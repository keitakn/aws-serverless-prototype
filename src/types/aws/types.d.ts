/**
 * aws-lambdaのeventインターフェース
 *
 * @author keita-nishimoto
 * @since 2016-03-11
 */
export interface LambdaEvent {
  headers: {[name: string]: string};
}
