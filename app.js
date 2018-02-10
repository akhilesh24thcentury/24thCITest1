var express = require('express');
var {graphql, buildSchema } = require('graphql');
var uc = require('upper-case');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
	hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
  },
  hello: () => {
    return uc("Hello Akhilesh!") + ' saying ' + 'hello world!!';
  },
};

var app = express();

app.get('/hello', function(req, res) {
  var message = graphql(schema, '{ hello }', root).then((resp) => {   
	  res.send({resp}); 
	  });
});

app.get('/quote', function(req, res) {
  var message = graphql(schema, '{ quoteOfTheDay }', root).then((resp) => {   
	  res.send({resp}); 
	  });
});

app.get('/', function(req, res) {
  var message = graphql(schema, '{ rollThreeDice }', root).then((resp) => {   
	  res.send({resp}); 
	  });
});


//app.listen(4000);
//console.log('Running a GraphQL API server at localhost:4000/graphql');

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app