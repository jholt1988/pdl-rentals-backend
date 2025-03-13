// lease.js'

export default (sequelize, DataTypes) => {
  const Lease = sequelize.define("Lease", {
    propertyId: { type: DataTypes.INTEGER, allowNull: false },
    tenantId: { type: DataTypes.INTEGER, allowNull: false },
    rentAmount: { type: DataTypes.DECIMAL, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending",
      validate: { isIn: [["pending", "approved", "active", "terminated"]] }
    }
  });

  Lease.associate = (models) => {
    Lease.belongsTo(models.Property, { foreignKey: "propertyId" });
    Lease.belongsTo(models.User, { foreignKey: "tenantId" });
  };

  return Lease;
};
