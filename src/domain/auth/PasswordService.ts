import * as crypto from "crypto";
import PasswordHash from "./PasswordHash";

/**
 * PasswordService
 *
 * @author keita-nishimoto
 * @since 2017-02-06
 */
export default class PasswordService {

  /**
   * パスワードハッシュオブジェクトを生成する
   *
   * @param password
   * @returns {PasswordHash}
   */
  public static generatePasswordHash(password: string): PasswordHash {

    const sha512 = crypto.createHash("sha512");
    sha512.update(password);
    const passwordHashStr = sha512.digest("hex");

    return new PasswordHash(passwordHashStr, password);
  }
}
