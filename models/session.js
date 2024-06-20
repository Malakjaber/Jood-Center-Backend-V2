module.exports = (sequelize, DataTypes) => {
  const session = sequelize.define(
    "session",
    {
      sid: { type: DataTypes.STRING(36), primaryKey: true },
      userId: { type: DataTypes.STRING(36) },
      role: { type: DataTypes.STRING(36) },
    },
    {
      timestamps: true,
    }
  );
  return session;
};
