import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import AccessTokenEntity from "../../../../domain/auth/AccessTokenEntity";
import {UserApi} from "../../../lib/UserApi";

/**
 * 認証のテスト
 */
describe("Authentication", () => {

  /**
   * テストに使うアクセストークン
   */
  let accessToken: string;

  /**
   * テストに使うユーザーID
   */
  let userId: string;

  /**
   * 事前にトークンを取得しユーザーを作成する
   */
  beforeEach((done: Function) => {
    const request: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_users", "prototype_clients"]
    };

    AuthApi.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
      const accessTokenRepository = new AccessTokenRepository();
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity) => {
      accessToken = accessTokenEntity.token;

      const createUserRequest = {
        email: "keita@gmail.com",
        password: "password1234",
        name: "keita",
        gender: "male",
        birthdate: "1990-01-01"
      };

      return UserApi.ApiClient.create(createUserRequest, accessToken);
    }).then((response) => {
      userId = response.data.id;
      done();
    });
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccess", (done: Function) => {
    const password = "password1234";

    const request = {
      id: userId,
      password: password
    };

    AuthApi.ApiClient.authentication(request).then((response) => {
      assert.equal(response.data.authenticated, true);
      assert.equal(response.data.subject, userId);
      assert.equal(response.data.claims.email, "keita@gmail.com");
      assert.equal(response.data.claims.email_verified, 0);
      assert.equal(response.data.claims.gender, "male");
      assert.equal(response.data.claims.birthdate, "1990-01-01");
      done();
    });
  });

  /**
   * 異常系テストケース
   * ユーザーが存在しない
   */
  it("testFailUserDoseNotExist", (done: Function) => {
    const failUserId = "99999999-mono-9999-1234-mono99999999";
    const password   = "password1234";

    const request = {
      id: failUserId,
      password: password
    };

    AuthApi.ApiClient.authentication(request).catch((error) => {
      assert.equal(error.response.status, 404);
      assert.equal(error.response.data.code, 404);
      done();
    });
  });

  /**
   * 異常系テストケース
   * 認証失敗（パスワード間違え）
   */
  it("testFailAuthentication", (done: Function) => {
    const password = "FailPassword";

    const request = {
      id: userId,
      password: password
    };

    AuthApi.ApiClient.authentication(request).catch((error) => {
      assert.equal(error.response.status, 401);
      assert.equal(error.response.data.code, 401);
      done();
    });
  });
});
