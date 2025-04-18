import db from '../../models/index';
import leaseController from '../leaseController';
import jest from 'jest';

// Mock the database models
jest.mock('../../models/index.js', () => ({
    Lease: {
        findAll: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
    }
}));

describe('Lease Controller', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Setup mock request and response objects
        mockRes = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            statusCode: jest.fn().mockReturnThis()
        };
        mockReq = {
            params: {},
            body: {}
        };
    });

    describe('getAllLeases', () => {
        it('should return all leases successfully', );

        it('should handle errors when getting all leases', async () => {
            const error = new Error('Database error');
            db.Lease.findAll.mockRejectedValue(error);

            await leaseController.getAllLeases(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('createLease', () => {
        it('should create a lease successfully', async () => {
            const mockLease = { id: 1, tenant: 'John Doe' };
            mockReq.body = mockLease;
            db.Lease.create.mockResolvedValue(mockLease);

            await leaseController.createLease(mockReq, mockRes);

            expect(db.Lease.create).toHaveBeenCalledWith(mockLease);
            expect(mockRes.json).toHaveBeenCalledWith(mockLease);
            expect(mockRes.statusCode).toHaveBeenCalledWith(201);
        });

        it('should handle errors when creating a lease', async () => {
            const error = new Error('Validation error');
            db.Lease.create.mockRejectedValue(error);

            await leaseController.createLease(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
        });
    });

    describe('getLeaseById', () => {
        it('should return a lease when found', async () => {
            const mockLease = { id: 1, tenant: 'John Doe' };
            mockReq.params.id = 1;
            db.Lease.findByPk.mockResolvedValue(mockLease);

            await leaseController.getLeaseById(mockReq, mockRes);

            expect(db.Lease.findByPk).toHaveBeenCalledWith(1);
            expect(mockRes.json).toHaveBeenCalledWith(mockLease);
        });

        it('should return 404 when lease is not found', async () => {
            mockReq.params.id = 999;
            db.Lease.findByPk.mockResolvedValue(null);

            await leaseController.getLeaseById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Lease not found' });
        });
    });

    describe('updateLease', () => {
        it('should update a lease successfully', async () => {
            const mockLease = {
                id: 1,
                tenant: 'John Doe',
                update: jest.fn()
            };
            mockReq.params.id = 1;
            mockReq.body = { tenant: 'Jane Doe' };
            db.Lease.findByPk.mockResolvedValue(mockLease);
            mockLease.update.mockResolvedValue({ ...mockLease, ...mockReq.body });

            await leaseController.updateLease(mockReq, mockRes);

            expect(db.Lease.findByPk).toHaveBeenCalledWith('1');
            expect(mockLease.update).toHaveBeenCalledWith(mockReq.body);
            expect(mockRes.json).toHaveBeenCalledWith(mockLease);
        });

        it('should return 404 when updating non-existent lease', async () => {
            mockReq.params.id = 999;
            db.Lease.findByPk.mockResolvedValue(null);

            await leaseController.updateLease(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Lease not found' });
        });
    });

    describe('deleteLease', () => {
        it('should delete a lease successfully', async () => {
            const mockLease = {
                id: 1,
                destroy: jest.fn()
            };
            mockReq.params.id = 1;
            db.Lease.findByPk.mockResolvedValue(mockLease);

            await leaseController.deleteLease(mockReq, mockRes);

            expect(db.Lease.findByPk).toHaveBeenCalledWith('1');
            expect(mockLease.destroy).toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({ message: 'Lease deleted' });
        });

        it('should return 404 when deleting non-existent lease', async () => {
            mockReq.params.id = 999;
            db.Lease.findByPk.mockResolvedValue(null);

            await leaseController.deleteLease(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: 'Lease not found' });
        });
    });
});
