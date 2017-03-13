import {assert} from "chai";
import {ResourceApi} from "../../../lib/ResourceApi";

/**
 * リソース削除のテスト
 */
describe("DestroyResource", () => {

  /**
   * 事前にリソース登録を行っておく
   */
  beforeEach(() => {
    const request: ResourceRequest.CreateRequest = {
      http_method: "POST",
      resource_path: "tests",
      name: "テストに利用するリソース",
      scopes: ["test"]
    };

    return ResourceApi.ApiClient.create(request).then(() => {});
  });

  /**
   * 正常系のテストケース
   *
   * 削除対象のリソースが存在し、削除に成功
   */
  it("testSuccessDestroy", () => {
    const resourceId = "POST_tests";

    return (async () => {
      const resourceResponse = await ResourceApi.ApiClient.find(resourceId);
      assert.equal(resourceResponse.status, 200);

      const destroyResponse = await ResourceApi.ApiClient.destroy(resourceId);
      assert.equal(destroyResponse.status, 204);

      await ResourceApi.ApiClient.find(resourceId);

    })().catch((error) => {
      assert.equal(error.response.status, 404);
      assert.equal(error.response.data.code, 404);
    });
  });

  /**
   * 正常系のテストケース
   *
   * 削除対象のリソースが存在しない
   */
  it("testSuccessDoseNotExistResourceDestroy", () => {
    const resourceId = "GET_tests";

    return ResourceApi.ApiClient.destroy(resourceId).then((response) => {
      assert.equal(response.status, 204);
    });
  });
});
