import express from "express";
import { renderIndex } from "../controllers/client.controller";

const router = express.Router();

router.get("/", renderIndex);

export { router as clientRouter };
