import express from "express";
import { renderIndex } from "../controllers/project.controller";
import { createCore } from "../controllers/project.controller";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/core", upload.single("core"), createCore, renderIndex);

router.get("/", renderIndex);

export { router as projectRouter };
