import express from "express";
import AuthController from "./auth/AuthController";
import AdminController from "./admin/AdminController";
import AppController from "./app/AppController";
import { auth } from "../../middleware/auth";

const router = express.Router();

router.get("/", async (req, res) => {
    res.send("co cl");
});

router.use("/auth", AuthController);
router.use("/admin", AdminController);
router.use("/app", auth, AppController);


export default router;