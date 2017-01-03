'use strict';

const clientCreate = require('./client-create.js');
const clientFind = require('./client-find.js');

module.exports.create = (event, context, callback) => {
  clientCreate(event, (error, result) => {
    const response = {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};

module.exports.find = (event, context, callback) => {
  clientFind(event, (error, result) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*"
      },
      body: JSON.stringify(result),
    };

    context.succeed(response);
  });
};
