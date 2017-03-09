import {assert} from "chai";
import {AuthApi} from "../../../lib/AuthApi";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import AccessTokenEntity from "../../../../domain/auth/AccessTokenEntity";
import {ClientApi} from "../../../lib/ClientApi";

/**
 * 認可のテスト
 */
describe("Authorization", () => {

  /**
   * 正常系のテストケース
   * クライアントクレデンシャルで発行したアクセストークンでAPIを呼び出せる事
   */
  it("testSuccessClientCredentials", () => {
    const request: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_clients"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
      const accessTokenRepository = new AccessTokenRepository();
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity) => {
      return ClientApi.ApiClient.find(request.clientId, accessTokenEntity.token);
    }).then((response) => {
      assert.equal(response.status, 200);
      assert.equal(response.data.client_id, request.clientId);
    });
  });
});
