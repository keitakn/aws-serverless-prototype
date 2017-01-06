export interface LambdaExecutionContext {
    callbackWaitsForEmptyEventLoop: boolean
    logGroupName:                   string
    logStreamName:                  string
    functionName:                   string
    memoryLimitInMB:                string
    functionVersion:                string
    invokeid:                       string
    awsRequestId:                   string
    invokedFunctionArn:             string
}
