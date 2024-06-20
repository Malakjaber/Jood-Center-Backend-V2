module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      userId: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  user.associate = function (models) {
    user.belongsTo(models.role, { foreignKey: "roleId" });
  };
  return user;
};
