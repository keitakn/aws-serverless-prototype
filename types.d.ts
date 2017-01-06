export interface LambdaExecutionContext {
  callbackWaitsForEmptyEventLoop: boolean
  done:                           Function
  succeed:                        Function
  fail:                           Function
  logGroupName:                   string
  logStreamName:                  string
  functionName:                   string
  memoryLimitInMB:                string
  functionVersion:                string
  getRemainingTimeInMillis:       Function
  invokeid:                       string
  awsRequestId:                   string
  invokedFunctionArn:             string
}
