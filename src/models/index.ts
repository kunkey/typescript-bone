import sequelize from "../database/connection";
import { UserModel } from "./User";


UserModel;

const models = sequelize.sync({ alter: true, logging: false });

export { models };
