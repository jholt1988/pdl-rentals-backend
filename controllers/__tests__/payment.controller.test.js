// src/controllers/__tests__/payments.controller.test.js
import request from 'supertest';
import app from '../../server.js';
import {sequelize} from '../../models/index.js';

// beforeAll(async () => {
//     await sequelize.sync({ force: true });
// });

describe('Payments API', () => {
    it('should create a new payment', async () => {
        const res = await request(app)
            .post('/api/payments')
            .send({
                amount: 1000,
                method: 'Credit Card',
                tenantId: 1,
                leaseId: 1
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.amount).toBe(1000);
    });

    it('should return a list of payments', async () => {
        const res = await request(app).get('/api/payments');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
