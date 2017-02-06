import * as crypto from "crypto";
import PasswordHash from "./PasswordHash";

/**
 * PasswordService
 *
 * @author keita-nishimoto
 * @since 2016-02-06
 */
export default class PasswordService {

  /**
   * パスワードハッシュオブジェクトを生成する
   *
   * @param password
   * @returns {Promise<PasswordHash>}
   */
  static generatePasswordHash(password: string): Promise<PasswordHash> {

    return new Promise<PasswordHash>((resolve: Function, reject: Function) => {

      try {
        const sha512 = crypto.createHash("sha512");
        sha512.update(password);

        const passwordHashStr = sha512.digest("hex");

        resolve(
          new PasswordHash(passwordHashStr, password)
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}
