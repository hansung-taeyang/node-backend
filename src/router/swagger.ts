import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

// TODO: Edit the options
const options: swaggerJsdoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Flutter Ppurio API",
      version: "1.0.0",
    },
  },
  apis: ["./src/router/*.ts", "./src/zod-schema/*.ts"],
};

const specs = swaggerJsdoc(options);

const router = Router();
router.use("/", swaggerUi.serve, swaggerUi.setup(specs));
export default router;