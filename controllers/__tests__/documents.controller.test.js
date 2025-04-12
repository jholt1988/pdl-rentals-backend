
// src/controllers/__tests__/documents.controller.test.js
import request from 'supertest';
import app from '../../server.js';
import {sequelize} from '../../models/index.js';
import path from 'path';

// beforeAll(async () => {
//     await sequelize.sync({ force: true });
// });

describe('Documents API', () => {
    it('should upload a document', async () => {
        const res = await request(app)
            .post('/api/documents')
            .field('title', 'Test Doc')
            .field('description', 'Testing file upload')
            .attach('file', path.resolve(__dirname, '../../../public/test-file.pdf'));

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Test Doc');
    });

    it('should list uploaded documents', async () => {
        const res = await request(app).get('/api/documents');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
