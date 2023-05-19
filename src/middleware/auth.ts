import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ERROR_CODES } from "../util/constants";
import config from "../config";
import {  UserModel, UserInterface } from "../models/User";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const payload: any = jwt.verify(token, config.JWT_KEY);
        const user: UserInterface = await UserModel.findOne({
            where: { id: payload.id },
            include: {
                as: "role",
                attributes: ["slug"]
            }
        });
        if (user == null) {
            return res.status(401).send({ code: ERROR_CODES.InvalidOrExpiredToken });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({
            error: "Not authorized to access this resource",
            code: ERROR_CODES.SomeErrorsOccurredPleaseTryAgain
        });
    }
};