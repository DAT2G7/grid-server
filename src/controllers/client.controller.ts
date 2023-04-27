import { RequestHandler } from "express";

/**
 * Serve the client index page
 */
export const renderIndex: RequestHandler = (_req, res) => {
    res.render("client/index");
};

/**
 * Serve the client index page
 */
export const renderPrivacy: RequestHandler = (_req, res) => {
    res.render("client/privacy");
};
