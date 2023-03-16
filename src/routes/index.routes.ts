import express from "express";

const router = express.Router();

// Redirect to the client index page
router.get("/", (_req, res) => {
    res.redirect("/client");
});

export { router as indexRouter };
