module.exports = (sequelize, DataTypes) => {
  const student = sequelize.define("student", {
    st_id: {
      type: DataTypes.STRING(15),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    pathological_case: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
    },
    medicines: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  student.associate = function (models) {
    student.belongsTo(models.class, { foreignKey: "class_id" });
    student.belongsTo(models.user, { foreignKey: "userId" });
    student.hasMany(models.report, {
      foreignKey: "st_id",
      onDelete: "CASCADE",
    });
  };

  return student;
};
