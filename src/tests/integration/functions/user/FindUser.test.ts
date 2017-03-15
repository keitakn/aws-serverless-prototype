import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import AccessTokenEntity from "../../../../domain/auth/AccessTokenEntity";
import {UserApi} from "../../../lib/UserApi";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";

/**
 * ユーザー取得のテスト
 */
describe("FindUser", () => {

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
  beforeEach(() => {
    const request: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_users"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
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
    });
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    return UserApi.ApiClient.find(userId, accessToken).then((response) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.email, "keita@gmail.com");
      assert.equal(response.data.email_verified, 0);
      assert.equal(response.data.name, "keita");
      assert.equal(response.data.gender, "male");
      assert.equal(response.data.birthdate, "1990-01-01");
    });
  });

  /**
   * 異常系テストケース
   * ユーザーが存在しない
   */
  it("testFailUserDoseNotExist", () => {
    const failUserId = "99999999-mono-9999-1234-mono99999999";

    return UserApi.ApiClient.find(failUserId, accessToken).catch((error) => {
      assert.equal(error.response.status, 404);
      assert.equal(error.response.data.code, 404);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const failUserId = "subject";

    return UserApi.ApiClient.find(failUserId, accessToken).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "subject"
      );
    });
  });
});
