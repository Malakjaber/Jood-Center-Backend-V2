module.exports = (sequelize, DataTypes) => {
  const treatment_plan = sequelize.define(
    "treatment_plan",
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
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  treatment_plan.associate = function (models) {
    treatment_plan.belongsTo(models.class, { foreignKey: "class_id" });
    treatment_plan.belongsTo(models.user, { foreignKey: "teacher_id" });
  };

  return treatment_plan;
};
