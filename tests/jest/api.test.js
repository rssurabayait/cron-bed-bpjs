const request = require('supertest');
const express = require('express');
const apiRoutes = require('../../src/routes/api');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

jest.mock('../../src/controllers/syncController', () => ({
  runSync: (req, res) => {
    return res.status(200).json({
      status: 'success',
      message: 'Mock Sync Success',
      data: { localCapacity: 100, remoteCapacity: 100 }
    });
  }
}));

describe('API Endpoints', () => {

  it('GET /api/status harus return 200 & online', async () => {
    const res = await request(app).get('/api/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('online');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api/sync harus return 200', async () => {
    const res = await request(app).get('/api/sync');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('success');
  });
});