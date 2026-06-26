import request from 'supertest';
import app from '@/app';

import { LoginResponse, ErrorResponse } from 'tests/types/responses';
import { UserFactory } from '../../factories/UserFactory';

describe('Login', () => {
  describe('✅ Success cases', () => {
    it('should login successfully', async () => {
      const { user, plainPassword } = await UserFactory.create();

      const response = await request(app).post('/login').send({
        email: user.email,
        password: plainPassword
      });

      const body = response.body as LoginResponse;
      expect(response.status).toBe(200);
      expect(body).toHaveProperty('token');
      expect(typeof body.token).toBe('string');
    });
  });

  describe('❌ Wrong credentials', () => {
    it('should fail with wrong password', async () => {
      const { user } = await UserFactory.create();

      const response = await request(app).post('/login').send({
        email: user.email,
        password: 'wrong-password'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Incorrect password');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app).post('/login').send({
        email: 'ghost@notfound.com',
        password: '123456'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toBe('User not found.');
    });
  });

  describe('❌ Missing fields', () => {
    it('should fail without email', async () => {
      const response = await request(app).post('/login').send({
        password: '123456'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toBe('Email is required.');
    });

    it('should fail without password', async () => {
      const { user } = await UserFactory.create();

      const response = await request(app).post('/login').send({
        email: user.email
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toBe('Password is required.');
    });

    it('should fail with empty body', async () => {
      const response = await request(app).post('/login').send({});

      expect(response.status).toBe(422);
    });
  });

  describe('❌ Invalid format', () => {
    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/login').send({
        email: 'non-an-email',
        password: '123456'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toBe('Invalid email format.');
    });
  });
});
