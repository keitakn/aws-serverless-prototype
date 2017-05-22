import * as AWS from "aws-sdk";
import {DynamoDB} from "aws-sdk";
import DocumentClient = DynamoDB.DocumentClient;
import Environment from "../infrastructures/Environment";

/**
 * AwsSdkFactory
 *
 * @author keita-nishimoto
 * @since 2017-01-30
 */
export default class AwsSdkFactory {

  /**
   * DynamoDB.DocumentClientを生成する
   *
   * @returns {DynamoDB.DocumentClient|DocumentClient}
   */
  public static createDynamoDbDocumentClient(): DocumentClient {
    if (Environment.isLocal() === true) {
      // DocumentClientOptionsというInterfaceで渡さないとダメみたい
      const documentClientOptions = {
        region: "localhost",
        endpoint: "http://localhost:8000",
      };

      return new AWS.DynamoDB.DocumentClient(documentClientOptions);
    }

    return new AWS.DynamoDB.DocumentClient();
  }
}
