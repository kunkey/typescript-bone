import express from "express";
const router = express.Router();
import UserController from "./UserController";

router.use("/users", UserController);

export default router;
