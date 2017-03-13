import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi"
import {UserApi} from "../../../lib/UserApi";

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
    const request: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_users"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
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
      birthdate: "1990-01-01"
    };

    return UserApi.ApiClient.create(request, accessToken).then((response) => {
      assert.equal(response.status, 201);
      assert.equal(response.data.email, "keita@gmail.com");
      assert.equal(response.data.email_verified, 0);
      assert.equal(
        response.data.password_hash,
        "8c7c9d16278ac60a19776f204f3109b1c2fc782ff8b671f42426a85cf72b1021887dd9e4febe420dcd215ba499ff12e230daf67afffde8bf84befe867a8822c4"
      );
      assert.equal(response.data.name, "keita");
      assert.equal(response.data.gender, "male");
      assert.equal(response.data.birthdate, "1990-01-01");

      return UserApi.ApiClient.find(response.data.id, accessToken);
    }).then((response) => {
      assert.equal(response.status, 200);
    });
  });
});
