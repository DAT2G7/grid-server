import express from "express";
import { renderIndex } from "../controllers/project.controller";
import { createCoreAPI } from "../controllers/api/project.controller";
import multer from "multer";

const upload = multer();
const router = express.Router();

router.post("/core", upload.single("core"), createCoreAPI, renderIndex);

router.get("/", renderIndex);

export { router as projectRouter };
