'use strict';
import { Model } from 'sequelize';
/**
 * This is the Notification model.
 * It represents a notification in the system.
 * @class Notification
 * @extends Model
 */
export default (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notification.init({
    userId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    message: DataTypes.STRING,
    isRead: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};