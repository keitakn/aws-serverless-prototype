import {assert} from "chai";
import {ResourceRequest} from "../../../../domain/resource/request/ResourceRequest";
import {ResourceTest} from "../../../lib/ResourceTest";

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
      scopes: ["tests"],
    };

    return ResourceTest.ApiClient.create(request);
  });

  /**
   * 正常系のテストケース
   */
  it("testSuccess", () => {
    const resourceId = "POST.tests";

    return (async () => {
      const resourceFindResponse = await ResourceTest.ApiClient.find(resourceId);

      assert.equal(resourceFindResponse.status, 200);
      assert.equal(resourceFindResponse.data.resource_id, "POST/tests");
      assert.equal(resourceFindResponse.data.http_method, "POST");
      assert.equal(resourceFindResponse.data.resource_path, "tests");
      assert.equal(resourceFindResponse.data.name, "テストに利用するリソース");
      assert.deepEqual(resourceFindResponse.data.scopes, ["tests"]);
    })();
  });

  /**
   * 正常系のテストケース
   *
   * リソースが存在しない
   */
  it("testSuccessDoseNotExistResource", () => {
    const resourceId = "GET.no";

    return ResourceTest.ApiClient.find(resourceId).catch((error) => {
      assert.equal(error.response.status, 404);
      assert.equal(error.response.data.code, 404);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const resourceId = "TRACE-users";

    return ResourceTest.ApiClient.find(resourceId).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "resource_id",
      );
    });
  });
});
