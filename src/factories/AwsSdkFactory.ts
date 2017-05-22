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
   * 自身のインスタンス
   */
  private static _instance: AwsSdkFactory;

  /**
   * constructor
   * シングルトンなのでprivateで宣言
   */
  private constructor() {
  }

  /**
   * 自身のインスタンスを取得する
   *
   * @returns {AwsSdkFactory}
   */
  public static getInstance(): AwsSdkFactory {
    if (AwsSdkFactory._instance) {
      return AwsSdkFactory._instance;
    }

    AwsSdkFactory._instance = new AwsSdkFactory();

    return AwsSdkFactory._instance;
  }

  /**
   * DynamoDB.DocumentClientを生成する
   *
   * @returns {DynamoDB.DocumentClient|DocumentClient}
   */
  createDynamoDbDocumentClient(): DocumentClient {
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
