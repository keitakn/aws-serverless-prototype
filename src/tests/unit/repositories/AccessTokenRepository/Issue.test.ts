import {assert} from "chai";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import {TestUtil} from "../../../lib/TestUtil";

/**
 * AccessTokenRepository.issueのテスト
 */
describe("Issue", () => {

  /**
   * 正常系テスト
   * モックを使用
   */
  it("testSuccess", () => {
    const mockResponse = {
      accessToken: '9999999999AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      accessTokenDuration: 86400,
      accessTokenExpiresAt: 1490335510238,
      action: 'OK'
    };

    const mockAdapter = () => {
      return new Promise((resolve: Function, reject: Function) => {
        resolve({
          data: mockResponse,
          status: 200
        });
      })
    };

    const axiosInstance = TestUtil.createMockAxiosInstance(mockAdapter);
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);

    return (async () => {
      // モックでリクエストを行っているので適当な値を設定すれば良い
      const accessTokenEntity = await accessTokenRepository.issue(
        "authorizationCode",
        "https://google.co.jp/oauth2/callback"
      );

      assert.equal(accessTokenEntity.accessToken, mockResponse.accessToken);
    })();
  });
});
