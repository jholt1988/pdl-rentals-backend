// models/LedgerEntry.js
'use strict';
import { Model } from 'sequelize';
export default (sequelize, DataTypes) => {
    class LedgerEntry extends Model {
        static associate(models) {
            // Associate a ledger entry with a tenant (and optionally a lease)
            LedgerEntry.belongsTo(models.Tenant, { foreignKey: 'tenantId' });
            LedgerEntry.belongsTo(models.Lease, { foreignKey: 'leaseId' });
        }
    }
    LedgerEntry.init(
        {
            tenantId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            leaseId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM('charge', 'payment'),
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            description: DataTypes.STRING,
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'LedgerEntry',
        }
    );
    return LedgerEntry;
};
