import express from "express";
import { renderIndex } from "../controllers/index.controller";

const router = express.Router();

router.get("/", renderIndex);

export { router as indexRouter };
