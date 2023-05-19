import { Request, Response, Router } from "express";
import { UserInterface, UserModel } from "../../../models/User";
import { Sequelize } from "sequelize";
import { findCredentials } from "../../../models/User";
import { encryptPassword } from "../../../util/md5password";

const router = Router();

/**
 * @openapi
 * /app/users/me:
 *   get:
 *     tags:
 *      - "[App] users"
 *     summary: Lấy thông tin tài khoản user
 *     responses:
 *       200:
 *         description: Return data.
 *       400:
 *         description: Error can't get data.
 *     security:
 *      - Bearer: []
 */
router.get("/me", async (req, res, next) => {
    try {
        const user: any = req.user;

        const userData: UserInterface = await UserModel.findOne({
            where: { id: user.id },
            attributes: [
                "id", "username", "nickname", "firstName", "lastName", "email", "bio", "avatar", "gender", "dateOfBirth", "totalCoin", "totalGiftExchange",
                [
                    Sequelize.literal("(SELECT COUNT(*) FROM feeds AS c WHERE c.authorId = users.id)"),
                    "totalFeed"
                ]
            ]
        });

        res.send({ user: userData });
    } catch (e) {
        res.status(400).send({
            error: e.message
        });
    }
});


export default router;
