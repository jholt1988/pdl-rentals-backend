import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class MaintenanceRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MaintenanceRequest.init({
    propertyId: DataTypes.INTEGER,
    tenantId: DataTypes.INTEGER,
    contractorId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'MaintenanceRequest',
  });
  return MaintenanceRequest;
};