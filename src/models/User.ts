import {
  DataTypes,
  Model
} from "sequelize";
import sequelize from "../database/connection";
import { ERROR_CODES } from "../util/constants";
import { encryptPassword } from "../util/md5password";
import config from "../config";
import jwt from "jsonwebtoken";

interface UserInterface {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  status: string;
  role: string;
  totalCoin: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

class UserModel extends Model<UserInterface> implements UserInterface {
  public id: number;
  public name: string;
  public username: string;
  public email: string;
  public password: string;
  public status: string;
  public role: string;
  public totalCoin: number;
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;

  static readonly STATUS_ENUM = {
    BLOCKED: "blocked",
    WORKING: "working",
  };
  static readonly ROLE_ENUM = {
    USER: "user",
    DEALER: "dealer",
    ADMIN: "admin"
  }
}

const UserDefine = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Tên người dùng không được bỏ trống." },
      notEmpty: { msg: "Tên người dùng không được bỏ trống." }
    }
  },
  email: { type: DataTypes.STRING },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: "Mật khẩu không được bỏ trống." },
      notEmpty: { msg: "Mật khẩu không được bỏ trống." }
    }
  },
  status: {
    type: DataTypes.ENUM({ values: Object.values(UserModel.STATUS_ENUM) }),
    defaultValue: UserModel.STATUS_ENUM.WORKING,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: UserModel.ROLE_ENUM.DEALER,
  },
  totalCoin: { type: DataTypes.INTEGER, defaultValue: 0 },
  createdAt: { type: DataTypes.DATE },
  updatedAt: { type: DataTypes.DATE },
  deletedAt: { type: DataTypes.DATE },
};

UserModel.init(UserDefine, {
  paranoid: true,
  indexes: [{ unique: true, fields: ["username"] }],
  tableName: "users",
  updatedAt: "updatedAt",
  createdAt: "createdAt",
  deletedAt: "deletedAt",
  sequelize,
});

// Func
const findCredentials = async (username: string, password: string) => {
  const user = await UserModel.findOne({
    where: { username: username, status: UserModel.STATUS_ENUM.WORKING },
  });
  if (user == null) {
    throw new Error(ERROR_CODES.InvalidLoginCredentials);
  }
  const passwordHash = encryptPassword(password);
  const passwordMatch = passwordHash == user.password;

  if (!passwordMatch) throw new Error(ERROR_CODES.InvalidLoginCredentials);
  return user;
};

const generateAuthToken = async (user: UserInterface | UserModel) => {
  const token = jwt.sign({ id: user.id }, config.JWT_KEY, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
  return token;
};



export {
  UserModel,
  UserInterface,
  generateAuthToken,
  findCredentials
};
