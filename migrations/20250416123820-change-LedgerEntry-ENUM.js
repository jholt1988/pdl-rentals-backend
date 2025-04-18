'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn('LedgerEntries', 'type', {
    type: Sequelize.ENUM('charge', 'adjustment', 'note', 'payment'),
    defaultValue: 'charge',
    allowNull: false,
  });
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn('LedgerEntries', 'type', {
    type: Sequelize.ENUM('charge', 'adjustment', 'note'),
    defaultValue: 'charge',
    allowNull: false,
  });
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
};
