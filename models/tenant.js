'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Tenant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tenant.init({
    userId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    leaseId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Tenant',
  });
  return Tenant;
};