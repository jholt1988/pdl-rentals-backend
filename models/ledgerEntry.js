// models/ledgerentry.js
export default (sequelize, DataTypes) => {
    const LedgerEntry = sequelize.define('LedgerEntry', {
        tenantId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        debit: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        credit: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        type: {
            type: DataTypes.ENUM('charge', 'adjustment', 'note'),
            defaultValue: 'charge'
        },
        createdBy: {
            type: DataTypes.STRING
        }
    });

    LedgerEntry.associate = (models) => {
        LedgerEntry.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
    };

    return LedgerEntry;
};
