import express from "express";
import { renderIndex } from "../controllers/project.controller";

const router = express.Router();

router.get("/", renderIndex);

export { router as projectRouter };
