// src/controllers/__tests__/maintenance.controller.test.js
import request from 'supertest';
import app from '../../server.js';
import db from '../../models/index.js';

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

describe('Maintenance API', () => {
    it('should create a maintenance request', async () => {
        const res = await request(app)
            .post('/api/maintenance')
            .send({
                title: 'Leaky faucet',
                description: 'Kitchen sink is leaking',
                priority: 'High',
                status: 'Open',
                propertyName: 'Unit A'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.priority).toBe('High');
    });

    it('should list all maintenance requests', async () => {
        const res = await request(app).get('/api/maintenance');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
