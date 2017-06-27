import {assert} from "chai";
import {ResourceRequest} from "../../../../domain/resource/request/ResourceRequest";
import {ResourceTest} from "../../../lib/ResourceTest";

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
      scopes: ["tests"],
    };

    return ResourceTest.ApiClient.create(request);
  });

  /**
   * 正常系のテストケース
   *
   * 削除対象のリソースが存在し、削除に成功
   */
  it("testSuccessDestroy", () => {
    const resourceId = "POST.tests";

    return (async () => {
      const resourceResponse = await ResourceTest.ApiClient.find(resourceId);
      assert.equal(resourceResponse.status, 200);

      const destroyResponse = await ResourceTest.ApiClient.destroy(resourceId);
      assert.equal(destroyResponse.status, 204);

      await ResourceTest.ApiClient.find(resourceId);

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
    const resourceId = "GET.tests";

    return ResourceTest.ApiClient.destroy(resourceId).then((response) => {
      assert.equal(response.status, 204);
    });
  });

  /**
   * 異常系テスト
   * バリデーションエラー
   */
  it("testFailValidation", () => {
    const resourceId = "TRACE-users";

    return ResourceTest.ApiClient.destroy(resourceId).catch((error) => {
      assert.equal(error.response.status, 422);
      assert.equal(error.response.data.code, 422);

      assert.property(
        error.response.data.errors,
        "resource_id",
      );
    });
  });
});
