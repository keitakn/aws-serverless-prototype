import {AxiosResponse} from "axios";
import {assert} from "chai";
import {AuthRequest} from "../../../../domain/auth/request/AuthRequest";
import {AuthTest} from "../../../lib/AuthTest";

/**
 * アクセストークン発行（認可コード）のテスト
 */
describe("IssueTokenFromCode", () => {

  /**
   * 正常系テスト
   */
  it("testSuccess", () => {
    const authleteApiKey = process.env.AUTHLETE_API_KEY;
    const request: AuthRequest.IssueAuthorizationCodeRequest = {
      client_id: 2118736939631,
      state: "neko123456789",
      redirect_uri: `https://api.authlete.com/api/mock/redirection/${authleteApiKey}`,
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      scopes: ["openid", "email", "offline_access", "prototype_users"],
    };

    return AuthTest.ApiClient.issueAuthorizationCode(request).then((response) => {
      const tokenRequest = {
        code: response.data.code,
        redirect_uri: request.redirect_uri,
      };

      return AuthTest.ApiClient.issueTokenFromCode(tokenRequest);
    }).then((response: AxiosResponse) => {
      // 要求を許可してあるスコープ以外は含まれていない事を確認する
      // テストに使うクライアントはoffline_accessの要求権限を持っていない
      assert.equal("email openid prototype_users", response.data.scope);
      assert.equal(86400, response.data.expires_in);
      assert.equal("Bearer", response.data.token_type);
      assert.equal(43, response.data.refresh_token.length);
      assert.equal(43, response.data.access_token.length);
    });
  });

  /**
   * 異常系テスト
   * 認可コード発行時と違うリダイレクトURIをリクエストする
   */
  it("testFailRedirectUriDoesNotMatch", () => {
    const authleteApiKey = process.env.AUTHLETE_API_KEY;
    const request: AuthRequest.IssueAuthorizationCodeRequest = {
      client_id: 2118736939631,
      state: "neko123456789",
      redirect_uri: `https://api.authlete.com/api/mock/redirection/${authleteApiKey}`,
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      scopes: ["openid", "email", "offline_access", "prototype_users"],
    };

    return AuthTest.ApiClient.issueAuthorizationCode(request).then((response: AxiosResponse) => {
      const tokenRequest = {
        code: response.data.code,
        redirect_uri: "https://api.authlete.com/api/mock/redirection",
      };
      return AuthTest.ApiClient.issueTokenFromCode(tokenRequest);
    }).catch((error) => {
      assert.equal(error.response.status, 400);
      assert.equal(error.response.data.code, 400);
    });
  });

  /**
   * 異常系テスト
   * 無効な認可コードをリクエストする
   */
  it("testFailAuthorizationCodeDoesNotExist", () => {
    const authleteApiKey = process.env.AUTHLETE_API_KEY;
    const tokenRequest = {
      code: "vPHtD8zkhYOPUwcQmwt4WGEHs8qv5XSvyMYbOWFq4kU",
      redirect_uri: `https://api.authlete.com/api/mock/redirection/${authleteApiKey}`,
    };

    return AuthTest.ApiClient.issueTokenFromCode(tokenRequest).catch((error) => {
      assert.equal(error.response.status, 400);
      assert.equal(error.response.data.code, 400);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const tokenRequest = {
      code: "vPHtD8zkhYOPUwcQmwt4WGEHs8qv5XSvyMYbOWFq4kU2",
      redirect_uri: `http`,
    };

    return AuthTest.ApiClient.issueTokenFromCode(tokenRequest).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "code",
      );

      assert.property(
        error.response.data.errors,
        "redirect_uri",
      );
    });
  });
});
