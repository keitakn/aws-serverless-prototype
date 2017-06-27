import {AxiosResponse} from "axios";
import {assert} from "chai";
import {AuthRequest} from "../../../../domain/auth/request/AuthRequest";
import {AuthTest} from "../../../lib/AuthTest";

/**
 * 認可コード発行のテスト
 */
describe("IssueAuthorizationCode", () => {
  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    const authleteApiKey = process.env.AUTHLETE_API_KEY;
    const request: AuthRequest.IssueAuthorizationCodeRequest = {
      client_id: 2118736939631,
      state: "neko123456789",
      redirect_uri: `https://api.authlete.com/api/mock/redirection/${authleteApiKey}`,
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      scopes: ["openid", "email", "prototype_clients"],
    };

    return AuthTest.ApiClient.issueAuthorizationCode(request).then((response: AxiosResponse) => {
      assert.equal(response.status, 201);
      assert.equal(response.data.code.length, 43);
      assert.equal(response.data.state, request.state);
    });
  });

  /**
   * 異常系テストケース
   * クライアントIDが存在しない
   */
  it("testFailClientDoseNotExist", () => {
    const authleteApiKey = process.env.AUTHLETE_API_KEY;
    const request: AuthRequest.IssueAuthorizationCodeRequest = {
      client_id: 1111111111111,
      state: "neko123456789",
      redirect_uri: `https://api.authlete.com/api/mock/redirection/${authleteApiKey}`,
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      scopes: ["openid", "email", "prototype_users"],
    };

    return AuthTest.ApiClient.issueAuthorizationCode(request).catch((error) => {
      assert.equal(error.response.status, 400);
      assert.equal(error.response.data.code, 400);
    });
  });

  /**
   * 異常系テスト
   * 登録されていないリダイレクトURIを指定
   */
  it("testFailRedirectUriNotRegistered", () => {
    const request: AuthRequest.IssueAuthorizationCodeRequest = {
      client_id: 2118736939631,
      state: "neko123456789",
      redirect_uri: `https://api.authlete.com/api/mock/redirection`,
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      scopes: ["openid", "email", "prototype_users"],
    };

    return AuthTest.ApiClient.issueAuthorizationCode(request).catch((error) => {
      assert.equal(error.response.status, 400);
      assert.equal(error.response.data.code, 400);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const request: AuthRequest.IssueAuthorizationCodeRequest = {
      client_id: 0,
      state: "1234567",
      redirect_uri: "url",
      subject: "98f46ad0-09e2-4324-910c-011df62e73071",
      scopes: ["food", "98f46ad0-09e2-4324-910c-011df62e73071"],
    };

    return AuthTest.ApiClient.issueAuthorizationCode(request).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "client_id",
      );

      assert.property(
        error.response.data.errors,
        "state",
      );

      assert.property(
        error.response.data.errors,
        "redirect_uri",
      );

      assert.property(
        error.response.data.errors,
        "subject",
      );

      assert.property(
        error.response.data.errors,
        "scopes[0]",
      );

      assert.property(
        error.response.data.errors,
        "scopes[1]",
      );
    });
  });
});
