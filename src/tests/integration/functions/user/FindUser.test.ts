import {AxiosResponse} from "axios";
import {assert} from "chai";
import {AccessTokenEntity} from "../../../../domain/auth/AccessTokenEntity";
import AuthleteHttpClientFactory from "../../../../factories/AuthleteHttpClientFactory";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";
import {AuthTest} from "../../../lib/AuthTest";
import {UserTest} from "../../../lib/UserTest";

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
  let subject: string;

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
      const axiosInstance = AuthleteHttpClientFactory.create();
      const accessTokenRepository = new AccessTokenRepository(axiosInstance);
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity.Entity) => {
      accessToken = accessTokenEntity.accessToken;

      const createUserRequest = {
        email: "keita@gmail.com",
        password: "password1234",
        name: "keita",
        gender: "male",
        birthdate: "1990-01-01",
      };

      return UserTest.ApiClient.create(createUserRequest, accessToken);
    }).then((response: AxiosResponse) => {
      subject = response.data.subject;
    });
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    return UserTest.ApiClient.find(subject, accessToken).then((response: AxiosResponse) => {
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
    const failSubject = "99999999-mono-9999-1234-mono99999999";

    return UserTest.ApiClient.find(failSubject, accessToken).catch((error) => {
      assert.equal(error.response.status, 404);
      assert.equal(error.response.data.code, 404);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const failSubject = "subject";

    return UserTest.ApiClient.find(failSubject, accessToken).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "subject",
      );
    });
  });
});
