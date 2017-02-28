import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";

/**
 * 認可コード発行のテスト
 */
describe("IssueAuthorizationCode", () => {

  /**
   * 正常系のテストケース
   */
  it("testSuccess", (done: Function) => {

    const authleteApiKey = process.env.AUTHLETE_API_KEY;
    const request: AuthApi.IssueAuthorizationCodeRequest = {
      client_id: 2118736939631,
      state: "neko123456789",
      redirect_uri: `https://api.authlete.com/api/mock/redirection/${authleteApiKey}`,
      subject: "98f46ad0-09e2-4324-910c-011df62e7307",
      scopes: ["openid", "email", "prototype_users"]
    };

    AuthApi.ApiClient.issueAuthorizationCode(request).then((response) => {
      assert.equal(response.status, 201);
      assert.equal(response.data.code.length, 43);
      assert.equal(response.data.state, request.state);
      done();
    });
  });
});
