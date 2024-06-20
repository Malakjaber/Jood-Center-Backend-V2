module.exports = (sequelize, DataTypes) => {
  const classes = sequelize.define(
    "class",
    {
      class_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  classes.associate = function (models) {
    classes.hasMany(models.treatment_plan, { foreignKey: "class_id" });
    classes.hasMany(models.student, { foreignKey: "class_id" });
    classes.hasMany(models.teacher_class, { foreignKey: "class_id" });
  };

  return classes;
};
