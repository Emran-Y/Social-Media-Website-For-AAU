const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "Description of my API",
  },
  servers: [
    {
      url: "http://localhost:5011",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./server.js", "./Controllers/*.js"], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
