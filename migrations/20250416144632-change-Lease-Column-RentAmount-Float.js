'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn("Leases", "rentAmount", {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0.00,
  });
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn("Leases", "rentAmount", {
    type: Sequelize.DECIMAL,
    allowNull: false,
  });
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
};
