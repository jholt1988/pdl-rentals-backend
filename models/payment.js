'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payment.init({
    leaseId: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL,
    date: DataTypes.DATE,
    method: DataTypes.STRING,
    receiptUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};