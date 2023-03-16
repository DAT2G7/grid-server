import { RequestHandler } from "express";

/**
 * Serve the project owner index page
 */
export const renderIndex: RequestHandler = (_req, res) => {
    res.render("client/index");
};
