import request from 'supertest';
import express from 'express';
import { createTask } from '../controllers/taskController.js';

const app = express();
app.use(express.json());
app.post('/api/tasks', createTask);

// Mocking Mongoose Data Layer Actions
jest.mock('../models/Task.js', () => {
  return function () {
    return { save: jest.fn().mockResolvedValue({ title: 'Mock Test Title Success Validation' }) };
  };
});

describe('POST /api/tasks Validation Tests', () => {
  it('Should send 400 status code code if title is missing', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ description: 'Valid long description data string for text field checking' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Title and description are required.');
  });

  it('Should send 400 status code if description length falls below 20 characters', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Valid Code Title', description: 'Too short.' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Description must be at least 20 characters long.');
  });
});