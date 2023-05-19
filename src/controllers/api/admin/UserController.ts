import express, { Response, Request } from "express";
import { UserInterface, UserModel } from "@models/User";
import { encryptPassword } from "@util/crypto";
import { excludeFields } from "@util/convert";
import { GridInterface } from "@models/Transformers/Grid";
const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    res.send("hi");
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

export default router;
