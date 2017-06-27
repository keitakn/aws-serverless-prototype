import {AxiosResponse} from "axios";
import {assert} from "chai";
import {UserRequest} from "../../../../domain/user/request/UserRequest";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";
import {AuthTest} from "../../../lib/AuthTest";
import {UserTest} from "../../../lib/UserTest";

/**
 * ユーザー作成のテスト
 */
describe("CreateUser", () => {

  /**
   * テストに使うアクセストークン
   */
  let accessToken: string;

  /**
   * 事前にトークンを取得しユーザーを作成する
   */
  beforeEach(() => {
    const request: AuthTest.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_users"],
    };

    return AuthTest.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
      accessToken = response.accessToken;
    });
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    const request: UserRequest.CreateRequest = {
      email: "keita@gmail.com",
      password: "password1234",
      name: "keita",
      gender: "male",
      birthdate: "1990-01-01",
    };

    return UserTest.ApiClient.create(request, accessToken).then((response) => {
      assert.equal(response.status, 201);
      assert.equal(response.data.email, "keita@gmail.com");
      assert.equal(response.data.email_verified, 0);
      assert.equal(
        response.data.password_hash,
        "8c7c9d16278ac60a19776f204f3109b1c2fc782ff8b671f42426a85cf72b1021887dd9e4febe420dcd215ba499ff12e230daf67afffde8bf84befe867a8822c4",
      );
      assert.equal(response.data.name, "keita");
      assert.equal(response.data.gender, "male");
      assert.equal(response.data.birthdate, "1990-01-01");

      return UserTest.ApiClient.find(response.data.subject, accessToken);
    }).then((response: AxiosResponse) => {
      assert.equal(response.status, 200);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const request: UserRequest.CreateRequest = {
      email: ".-keita@gmail.com",
      password: "passwd",
      name: "a",
      gender: "0",
      birthdate: "1990/01/01",
    };

    return UserTest.ApiClient.create(request, accessToken).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "email",
      );

      assert.property(
        error.response.data.errors,
        "password",
      );

      assert.property(
        error.response.data.errors,
        "name",
      );

      assert.property(
        error.response.data.errors,
        "gender",
      );

      assert.property(
        error.response.data.errors,
        "birthdate",
      );
    });
  });
});
