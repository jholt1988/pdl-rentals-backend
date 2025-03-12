'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Contractor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contractor.init({
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    serviceType: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Contractor',
  });
  return Contractor;
};