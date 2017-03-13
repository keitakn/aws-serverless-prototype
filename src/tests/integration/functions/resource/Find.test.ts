import {assert} from "chai";
import {ResourceApi} from "../../../lib/ResourceApi";

/**
 * リソース取得のテスト
 */
describe("FindResource", () => {

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
   */
  it("testSuccessDestroy", () => {
    const resourceId = "POST_tests";

    return (async () => {
      const resourceFindResponse = await ResourceApi.ApiClient.find(resourceId);

      assert.equal(resourceFindResponse.status, 200);
      assert.equal(resourceFindResponse.data.id, "POST/tests");
      assert.equal(resourceFindResponse.data.http_method, "POST");
      assert.equal(resourceFindResponse.data.resource_path, "tests");
      assert.equal(resourceFindResponse.data.name, "テストに利用するリソース");
      assert.deepEqual(resourceFindResponse.data.scopes, ["test"]);
    })();
  });

  /**
   * 正常系のテストケース
   *
   * リソースが存在しない
   */
  it("testSuccessDoseNotExistResourceDestroy", () => {
    const resourceId = "GET_no";

    return ResourceApi.ApiClient.find(resourceId).catch((error) => {
      assert.equal(error.response.status, 404);
      assert.equal(error.response.data.code, 404);
    });
  });
});
