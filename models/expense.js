'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Expense.init({
    propertyId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    description: DataTypes.STRING,
    date: DataTypes.DATE,
    contractorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};