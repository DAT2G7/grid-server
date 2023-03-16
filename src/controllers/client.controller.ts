import { RequestHandler } from "express";

/**
 * Serve the client index page
 */
export const renderIndex: RequestHandler = (_req, res) => {
    res.render("client/index");
};
