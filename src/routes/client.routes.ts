import { renderIndex, renderPrivacy } from "../controllers/client.controller";

import express from "express";

const router = express.Router();

router.get("/", renderIndex);

router.get("/privacy", renderPrivacy);

export { router as clientRouter };
