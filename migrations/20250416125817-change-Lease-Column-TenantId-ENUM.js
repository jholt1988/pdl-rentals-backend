'use strict';

/** @type {import('sequelize-cli').Migration} */
export const up = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn("Leases", "tenantId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Tenants',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
    
  });
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.changeColumn("Leases", "tenantId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: false,
    references: {
      model: 'Tenants',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  });
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
};
