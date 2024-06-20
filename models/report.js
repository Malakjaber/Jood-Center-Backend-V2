module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define(
    "report",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      st_id: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  report.associate = function (models) {
    report.belongsTo(models.student, { foreignKey: "st_id" });
    report.belongsTo(models.user, { foreignKey: "userId" });
  };
  return report;
};
