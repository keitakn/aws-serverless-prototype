import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";

/**
 * アクセストークン発行（認可コード）のテスト
 */
describe("IssueTokenFromCode", () => {

  /**
   * 正常系テスト
   */
  it("testSuccess", (done: Function) => {
    const authleteApiKey = process.env.AUTHLETE_API_KEY;
    const request: AuthApi.IssueAuthorizationCodeRequest = {
      client_id: 2118736939631,
      state: "neko123456789",
      redirect_uri: `https://api.authlete.com/api/mock/redirection/${authleteApiKey}`,
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      scopes: ["openid", "email", "offline_access", "prototype_users"]
    };

    AuthApi.ApiClient.issueAuthorizationCode(request).then((response) => {
      const tokenRequest = {
        code: response.data.code,
        redirect_uri: request.redirect_uri
      };

      return AuthApi.ApiClient.issueTokenFromCode(tokenRequest);
    }).then((response) => {
      // 要求を許可してあるスコープ以外は含まれていない事を確認する
      // テストに使うクライアントはoffline_accessの要求権限を持っていない
      assert.equal("email openid prototype_users", response.data.scope);
      assert.equal(86400, response.data.expires_in);
      assert.equal("Bearer", response.data.token_type);
      assert.equal(43, response.data.refresh_token.length);
      assert.equal(43, response.data.access_token.length);
      done();
    });
  });
});
