import {assert} from "chai";
import {AuthTest} from "../../../lib/AuthTest";
import AccessTokenRepository from "../../../../repositories/AccessTokenRepository";
import AccessTokenEntity from "../../../../domain/auth/AccessTokenEntity";
import {AuthleteAPIConstant} from "../../../../types/authlete/AuthleteAPIConstant";

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
      scopes: ["email"]
    };

    const accessTokenRepository = new AccessTokenRepository();
    return AuthTest.ApiClient.issueAccessTokenInCheatApi(request).then((response) => {
      return accessTokenRepository.fetch(response.accessToken);
    }).then((accessTokenEntity: AccessTokenEntity) => {
      assert.equal(
        accessTokenEntity.introspectionResponse.clientId,
        1957483863470
      );

      assert.equal(accessTokenEntity.token.length, 43);
    });
  });

  /**
   * 異常系テスト
   * 存在しないアクセストークンをリクエスト
   */
  it("testFailAccessTokenDoesNotExist", () => {
    const accessToken = "PO65AdqbwHI896SjX4FIH6eeV6cNRSe_QC9W45mCPV0";
    const accessTokenRepository = new AccessTokenRepository();

    return accessTokenRepository.fetch(accessToken).then((accessTokenEntity: AccessTokenEntity) => {
      assert.equal(
        accessTokenEntity.extractIntrospectionAction(),
        AuthleteAPIConstant.IntrospectionActions.BAD_REQUEST
      );
    });
  });
});
