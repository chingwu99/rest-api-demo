import express, { NextFunction } from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      console.log("currentUserId", currentUserId);
      return res.sendStatus(403);
    }

    if (currentUserId.toString() !== id) {
      console.log(
        "currentUserId.toString() !== id",
        currentUserId.toString() !== id
      );
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);

    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["HENRY-AUTH"];
    console.log("isAuthenticated req", req);
    console.log("req.cookies", req.cookies);
    if (!sessionToken) {
      console.log("!sessionToken", !sessionToken);
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      console.log("!existingUser", !existingUser);
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
