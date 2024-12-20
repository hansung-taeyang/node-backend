import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

// TODO: Edit the options
const options: swaggerJsdoc.Options = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "READ:ME API",
      version: "1.0.0",
    },
  },
  apis: [`${__dirname}/*.[jt]s`, `${__dirname}/../zod-schema/*.[jt]s`, `${__dirname}/../middleware/checkLogin.[jt]s`],
};

const specs = swaggerJsdoc(options);

const router = Router();
router.use("/", swaggerUi.serve, swaggerUi.setup(specs));
export default router;