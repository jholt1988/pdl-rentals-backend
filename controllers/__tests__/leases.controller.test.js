// src/controllers/__tests__/leases.controller.test.js
import request from 'supertest';
import app from '../../server.js';
import {sequelize} from '../../models/index.js';

// beforeAll(async () => {
//     await sequelize.sync({ force: true });
// });

describe('Leases API', () => {
    it('should create a lease', async () => {
        const res = await request(app)
            .post('/api/leases')
            .send({
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                rentAmount: 1500,
                propertyId: 1,
                tenantId: 1
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.rentAmount).toBe(1500);
    });

    it('should list all leases', async () => {
        const res = await request(app).get('/api/leases');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
