import { Router, type Request, type Response } from "express";

const router = Router();

/**
 * @openapi
 * /sample:
 *  get:
 *   description: Sample GET
 *   responses:
 *    '200':
 *      description: A successful response
 */
router.get("/", (req: Request, res: Response) => {
  res.json({ data: "GET /sample"});
});

/**
 * @openapi
 * /sample:
 *  post:
 *   description: Sample POST
 *   responses:
 *    '200':
 *      description: A successful response
 */
router.post("/", (req: Request, res: Response) => {
  res.json({ data: "POST /sample"});
});

export default router;