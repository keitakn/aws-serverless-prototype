/**
 * DynamoDbResponse
 *
 * @author keita-nishimoto
 * @since 2017-02-03
 * @todo 20170421 response形式が変わっているので見直す
 */
export namespace DynamoDbResponse {

  /**
   * UsersテーブルのResponse
   */
  export interface User {
    Item: {
      id: string;
      email: string;
      email_verified: number;
      password_hash: string;
      name: string;
      gender: string;
      birthdate: string;
      created_at: number;
      updated_at: number;
    };
  }

  /**
   * ResourcesテーブルのResponse
   */
  export interface Resource {
    Item: {
      id: string;
      http_method: string;
      resource_path: string;
      name: string;
      scopes: [string];
      created_at: number;
      updated_at: number;
    };
  }
}
