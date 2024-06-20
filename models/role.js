module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    "role",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false, 
    }
  );
  role.associate = function (models) {
    role.hasMany(models.user, { foreignKey: "roleId" });
  };
  return role;
};
