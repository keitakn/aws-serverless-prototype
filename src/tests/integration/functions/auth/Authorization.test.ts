import {AuthApi} from "../../../lib/AuthApi";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import AccessTokenEntity from "../../../../domain/auth/AccessTokenEntity";

/**
 * 認可のテスト
 */
describe("Authorization", () => {

  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    const request: AuthApi.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthApi.GrantTypesEnum.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["prototype_users", "prototype_clients"]
    };

    return AuthApi.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
      const accessTokenRepository = new AccessTokenRepository();
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity) => {
    });
  });
});
