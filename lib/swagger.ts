import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de gestion du menu",
      version: "1.0.0",
    },
    components: {
      schemas: {
        MenuItem: {
          type: "object",
          required: ["name"],
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Pizza" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        MenuItemInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Pizza" },
          },
        },
      },
    },
  },
  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
