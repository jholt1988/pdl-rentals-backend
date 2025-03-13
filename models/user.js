import { hash } from "bcryptjs";

export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "tenant" }
  });

  User.beforeSave(async (user) => {
    if (user.changed("password")) {
      user.password = await hash(user.password, 10);
    }
  });

  return User;
};