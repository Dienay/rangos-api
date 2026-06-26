import request from 'supertest';
import app from '@/app';

import { IUser } from '@/models/User';
import { ErrorResponse } from 'tests/types/responses';
import { UserFactory } from '../../factories/UserFactory';

describe('Signup', () => {
  describe('✅ Success cases', () => {
    it('should create user with all fields', async () => {
      const response = await request(app).post('/signup').send({
        avatar: 'https://example.com/avatar.jpg',
        name: 'Test User',
        email: 'test@test.com',
        phone: '86999999999',
        password: '123456',
        typeUser: 'Customer'
      });

      const body = response.body as IUser;

      expect(response.status).toBe(201);
      expect(body).toHaveProperty('_id');
      expect(body).toHaveProperty('token');
      expect(body.name).toBe('Test User');
      expect(body.email).toBe('test@test.com');
      expect(body.typeUser).toBe('Customer');
    });

    it('should create user without optional fields', async () => {
      const response = await request(app).post('/signup').send({
        name: 'Test User',
        email: 'noaddress@test.com',
        password: '123456'
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('token');
    });

    it('should create user with default typeUser as Customer', async () => {
      const response = await request(app).post('/signup').send({
        name: 'Test User',
        email: 'customer@test.com',
        password: '123456',
        phone: '86988888888'
      });

      const body = response.body as IUser;

      expect(response.status).toBe(201);
      expect(body.typeUser).toBe('Customer');
    });
  });

  describe('❌ Duplicate data', () => {
    it('should fail if email already exists', async () => {
      const email = 'dub@test.com';

      await UserFactory.create({ email });

      const response = await request(app).post('/signup').send({
        name: 'Test User',
        email,
        password: '123456',
        phone: '86999999997'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(409);
      expect(body.error.message).toBe('Email already exists.');
    });

    it('should fail if phone already exists', async () => {
      const phone = '86911111111';
      await UserFactory.create({ phone });

      const response = await request(app).post('/signup').send({
        name: 'Test User',
        email: 'unique@test.com',
        password: '123456',
        phone
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(409);
      expect(body.error.message).toBe('Phone already exists.');
    });
  });

  describe('❌ Missing required fields', () => {
    it('should fail without name', async () => {
      const response = await request(app).post('/signup').send({
        email: 'noname@test.com',
        password: '123456',
        phone: '86922222222'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Name is required');
    });

    it('should fail without email', async () => {
      const response = await request(app).post('/signup').send({
        name: 'Test User',
        password: '123456',
        phone: '86933333333'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Email is required');
    });

    it('should fail without password', async () => {
      const response = await request(app).post('/signup').send({
        name: 'Test User',
        emial: 'nopassword@test.com',
        phone: '86944444444'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Password is required');
    });

    it('should fail with empty body', async () => {
      const response = await request(app).post('/signup').send({});

      expect(response.status).toBe(422);
    });
  });

  describe('❌ Invalid format', () => {
    it('should fail with invalid email format', async () => {
      const response = await request(app).post('/signup').send({
        name: 'Test User',
        email: 'invalid-email',
        password: '123456',
        phone: '86955555555'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Invalid email format.');
    });

    it('should fail with password shorter than 6 characters', async () => {
      const response = await request(app).post('/signup').send({
        name: 'Test User',
        email: 'shorterpass@test.com',
        password: '123',
        phone: '86966666666'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Password must be at least 6 characters.');
    });

    it('should fail with invalid typeUser value', async () => {
      const response = await request(app).post('/signup').send({
        name: 'Test User',
        email: 'invalid-type@test@.com',
        password: '123456',
        phone: '86977777777',
        typeUser: 'Admin'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('is not a valid user type');
    });
  });

  describe('❌ Edge cases', () => {
    it('should fail with very long name', async () => {
      const response = await request(app)
        .post('/signup')
        .send({
          name: 'A'.repeat(300),
          email: 'long-name@test.com',
          password: '123456',
          phone: '86988888888'
        });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Name must be at most 100 characters.');
    });

    it('should fail with name containing only spaces', async () => {
      const response = await request(app).post('/signup').send({
        name: '      ',
        email: 'sapaces@test.com',
        password: '123456',
        phone: '86900000000'
      });

      const body = response.body as ErrorResponse;
      expect(response.status).toBe(422);
      expect(body.error.message).toContain('Name is required');
    });
  });
});
