// src/controllers/__tests__/tenants.controller.test.js
import request from 'supertest';
import app from '../../server.js';
import db from '../../models/index.js';

beforeAll(async () => {
    await db.sequelize.sync({ force: true });
});

describe('Tenants API', () => {
    it('should create a new tenant', async () => {
        const res = await request(app)
            .post('/api/tenants')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                phone: '555-1234'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('John Doe');
    });

    it('should list all tenants', async () => {
        const res = await request(app).get('/api/tenants');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
