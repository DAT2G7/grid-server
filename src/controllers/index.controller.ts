import { RequestHandler } from "express";

/**
 * Redirect to the client index page
 */
export const renderIndex: RequestHandler = (_req, res) => {
    res.redirect("/client");
};
