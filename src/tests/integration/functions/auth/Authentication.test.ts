import {AxiosResponse} from "axios";
import {assert} from "chai";
import {AccessTokenEntity} from "../../../../domain/auth/AccessTokenEntity";
import {AuthRequest} from "../../../../domain/auth/request/AuthRequest";
import AuthleteHttpClientFactory from "../../../../factories/AuthleteHttpClientFactory";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";
import {AuthTest} from "../../../lib/AuthTest";
import {UserTest} from "../../../lib/UserTest";

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
  let subject: string;

  /**
   * 事前にトークンを取得しユーザーを作成する
   */
  beforeEach(() => {
    const request: AuthTest.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_users", "prototype_clients"],
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
    const password = "password1234";

    const request = {
      subject,
      password,
    };

    return AuthTest.ApiClient.authentication(request).then((response: AxiosResponse) => {
      assert.equal(response.data.authenticated, true);
      assert.equal(response.data.subject, subject);
      assert.equal(response.data.claims.email, "keita@gmail.com");
      assert.equal(response.data.claims.email_verified, 0);
      assert.equal(response.data.claims.gender, "male");
      assert.equal(response.data.claims.birthdate, "1990-01-01");
    });
  });

  /**
   * 異常系テストケース
   * ユーザーが存在しない
   */
  it("testFailUserDoseNotExist", () => {
    const failSubject = "99999999-mono-9999-1234-mono99999999";
    const password    = "password1234";

    const request = {
      subject: failSubject,
      password,
    };

    return AuthTest.ApiClient.authentication(request).catch((error) => {
      assert.equal(error.response.status, 404);
      assert.equal(error.response.data.code, 404);
    });
  });

  /**
   * 異常系テストケース
   * 認証失敗（パスワード間違え）
   */
  it("testFailAuthentication", () => {
    const password = "FailPassword";

    const request = {
      subject,
      password,
    };

    return AuthTest.ApiClient.authentication(request).catch((error) => {
      assert.equal(error.response.status, 401);
      assert.equal(error.response.data.code, 401);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const request: AuthRequest.AuthenticationRequest = {
      subject: "98f46ad0-09e2-4324-910c-011df62e73071",
      password: "pass@wd",
    };

    return AuthTest.ApiClient.authentication(request).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "subject",
      );

      assert.property(
        error.response.data.errors,
        "password",
      );
    });
  });
});
