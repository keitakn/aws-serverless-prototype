import {assert} from "chai";
import {AccessTokenEntity} from "../../../../domain/auth/AccessTokenEntity";
import AuthleteHttpClientFactory from "../../../../factories/AuthleteHttpClientFactory";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";
import {AuthTest} from "../../../lib/AuthTest";

/**
 * AccessTokenRepository.fetchのテスト
 */
describe("Fetch", () => {

  /**
   * 正常系テスト
   */
  it("testSuccess", () => {
    const request: AuthTest.IssueAccessTokenInCheatApiRequest = {
      grantType: AuthleteAPIConstant.GrantTypes.CLIENT_CREDENTIALS,
      clientId: 1957483863470,
      scopes: ["email"],
    };

    const axiosInstance = AuthleteHttpClientFactory.create();
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);
    return AuthTest.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity.Entity) => {
      assert.equal(
        accessTokenEntity.introspectionResponse.clientId,
        1957483863470,
      );

      assert.equal(accessTokenEntity.accessToken.length, 43);
    });
  });

  /**
   * 異常系テスト
   * 存在しないアクセストークンをリクエスト
   */
  it("testFailAccessTokenDoesNotExist", () => {
    const accessToken = "PO65AdqbwHI896SjX4FIH6eeV6cNRSe_QC9W45mCPV0";
    const axiosInstance = AuthleteHttpClientFactory.create();
    const accessTokenRepository = new AccessTokenRepository(axiosInstance);

    return accessTokenRepository.fetch(accessToken).then((accessTokenEntity: AccessTokenEntity.Entity) => {
      assert.equal(
        accessTokenEntity.extractIntrospectionAction(),
        AuthleteAPIConstant.IntrospectionActions.UNAUTHORIZED,
      );
    });
  });
});
