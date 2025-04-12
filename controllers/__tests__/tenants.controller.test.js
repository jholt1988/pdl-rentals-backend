import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../../server.js'; // Assuming you have an Express app instance in app.js
import db from '../../models/index.js';

const { Tenant } = db;

jest.mock('../../models/index.js', () => {
    const actualDb = jest.requireActual('../../models/index.js');
    return {
        ...actualDb,
        Tenant: {
            findAll: jest.fn(),
            findByPk: jest.fn(),
            create: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue([1]),
            destroy: jest.fn().mockResolvedValue(1),
        },
    };
});

describe('Tenant Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllTenants', () => {
        it('should return all tenants with status 200', async () => {
            const mockTenants = [{ id: 1, name: 'John Doe' }];
            jest.spyOn(Tenant, 'findAll').mockResolvedValue(mockTenants);

            const response = await request(app).get('/api/tenants');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTenants);
            expect(Tenant.findAll).toHaveBeenCalledTimes(1);
        });

        it('should return status 500 on error', async () => {
            Tenant.findAll.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/tenants');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error retrieving tenants');
        });
    });

    describe('getTenantById', () => {
        it('should return a tenant by ID with status 200', async () => {
            const mockTenant = { id: 1, name: 'John Doe' };
            jest.spyOn(Tenant, 'findByPk').mockResolvedValue(mockTenant);

            const response = await request(app).get('/api/tenants/1');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockTenant);
            expect(Tenant.findByPk).toHaveBeenCalledWith('1');
        });

        it('should return status 404 if tenant not found', async () => {
            Tenant.findByPk.mockResolvedValue(null);

            const response = await request(app).get('/api/tenants/1');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Tenant not found');
        });

        it('should return status 500 on error', async () => {
            Tenant.findByPk.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/tenants/1');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error retrieving tenant');
        });
    });

    describe('createTenant', () => {
        it('should create a tenant and return status 201', async () => {
            const mockTenant = { id: 1, name: 'John Doe' };
            Tenant.create.mockResolvedValue(mockTenant);

            const response = await request(app)
                .post('/api/tenants')
                .send({ name: 'John Doe' });

            expect(response.status).toBe(201);
            expect(response.body).toEqual(mockTenant);
            expect(Tenant.create).toHaveBeenCalledWith({ name: 'John Doe' });
        });

        it('should return status 500 on error', async () => {
            Tenant.create.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .post('/api/tenants')
                .send({ name: 'John Doe' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error creating tenant');
        });
    });

    describe('updateTenant', () => {
        it('should update a tenant and return status 200', async () => {
            const mockTenant = {
                id: 1,
                name: 'John Doe',
                update: jest.fn().mockResolvedValue(),
            };
            Tenant.findByPk.mockResolvedValue(mockTenant);

            const response = await request(app)
                .put('/api/tenants/1')
                .send({ name: 'Jane Doe' });

            expect(response.status).toBe(200);
            expect(mockTenant.update).toHaveBeenCalledWith({ name: 'Jane Doe' });
        });

        it('should return status 404 if tenant not found', async () => {
            Tenant.findByPk.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/tenants/1')
                .send({ name: 'Jane Doe' });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Tenant not found');
        });

        it('should return status 500 on error', async () => {
            Tenant.findByPk.mockRejectedValue(new Error('Database error'));

            const response = await request(app)
                .put('/api/tenants/1')
                .send({ name: 'Jane Doe' });

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error updating tenant');
        });
    });

    describe('deleteTenant', () => {
        it('should delete a tenant and return status 200', async () => {
            const mockTenant = {
                id: 1,
                name: 'John Doe',
                destroy: jest.fn().mockResolvedValue(),
            };
            Tenant.findByPk.mockResolvedValue(mockTenant);

            const response = await request(app).delete('/api/tenants/1');

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Tenant deleted');
            expect(mockTenant.destroy).toHaveBeenCalledTimes(1);
        });

        it('should return status 404 if tenant not found', async () => {
            Tenant.findByPk.mockResolvedValue(null);

            const response = await request(app).delete('/api/tenants/1');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Tenant not found');
        });

        it('should return status 500 on error', async () => {
            Tenant.findByPk.mockRejectedValue(new Error('Database error'));

            const response = await request(app).delete('/api/tenants/1');

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Error deleting tenant');
        });
    });
});