import request from 'supertest';
import app from '@/app';

import { ErrorResponse, UserResponse, UpdateUserResponse } from 'tests/types/responses';
import { UserFactory } from '../../factories/UserFactory';

describe('Users', () => {
  describe('GET /users/:id', () => {
    describe('✅ Success cases', () => {
      it('should return a user by id', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).get(`/user/${user._id}`).set('Authorization', `Bearer ${token}`);
        const body = response.body as UserResponse;

        expect(response.status).toBe(200);
        expect(body.user._id).toBe(String(user._id));
        expect(body.user.name).toBe(user.name);
        expect(body.user.email).toBe(user.email);
      });
      it('should not return password field', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).get(`/user/${user._id}`).set('Authorization', `Bearer ${token}`);
        const body = response.body as UserResponse;

        expect(response.status).toBe(200);
        expect(body).not.toHaveProperty('password');
        expect(body.user).not.toHaveProperty('password');
      });
    });

    describe('❌ Authentication', () => {
      it('should fail without token', async () => {
        const { user } = await UserFactory.create();
        const response = await request(app).get(`/user/${user._id}`);
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(401);
        expect(body.error.message).toContain('Access denied. No token provided.');
      });
    });

    describe('❌ Not found', () => {
      it('should fail with non-existent id', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app)
          .get(`/user/64b0f1c2e4b0f1c2e4b0f1c2`)
          .set('Authorization', `Bearer ${token}`);
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(404);
        expect(body.error.message).toContain('User not found.');
      });

      it('should fail with invalid id format', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).get(`/user/invalid-id`).set('Authorization', `Bearer ${token}`);
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(400);
        expect(body.error.message).toContain('Invalid ID format');
      });
    });
  });

  describe('PUT /users/:id', () => {
    describe('✅ Success cases', () => {
      it('should update a user data', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).put(`/user/${user._id}`).set('Authorization', `Bearer ${token}`).send({
          name: 'Updated Name'
        });
        const body = response.body as UpdateUserResponse;

        expect(response.status).toBe(200);
        expect(body.user.name).toBe('Updated Name');
      });

      it('should update only sent fields', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).put(`/user/${user._id}`).set('Authorization', `Bearer ${token}`).send({
          name: 'Updated Name'
        });
        const body = response.body as UpdateUserResponse;

        expect(response.status).toBe(200);
        expect(body.user.name).toBe('Updated Name');
        expect(body.user.email).toBe(user.email);
      });
    });

    describe('❌ Authentication', () => {
      it('should fail without token', async () => {
        const { user } = await UserFactory.create();
        const response = await request(app).put(`/user/${user._id}`).send({
          name: 'No Token'
        });
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(401);
        expect(body.error.message).toContain('Access denied. No token provided.');
      });
    });

    describe('❌ Not found', () => {
      it('should fail with non-existent id', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app)
          .put('/user/64f1a2b3c4d5e6f7a8b9c0d1')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Ghost User'
          });
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(404);
        expect(body.error.message).toContain('User not found.');
      });
    });

    describe('❌ Duplicate data', () => {
      it('should fail if email already exists', async () => {
        const { user: userA, plainPassword } = await UserFactory.create();
        const { user: userB } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: userA.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).put(`/user/${userA._id}`).set('Authorization', `Bearer ${token}`).send({
          email: userB.email
        });
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(409);
        expect(body.error.message).toContain('Email already exists.');
      });

      it('should fail if phone already exists', async () => {
        const { user: userA, plainPassword } = await UserFactory.create();
        const { user: userB } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: userA.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).put(`/user/${userA._id}`).set('Authorization', `Bearer ${token}`).send({
          phone: userB.phone
        });
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(409);
        expect(body.error.message).toContain('Phone already exists.');
      });
    });

    describe('❌ Protected fields', () => {
      it('should not update password via PUT', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).post(`/user/${user._id}`).set('Authorization', `Bearer ${token}`).send({
          password: 'newpassword123'
        });

        const loginAfterUpdate = await request(app).post('/login').send({
          email: user.email,
          password: 'newpassword123'
        });

        expect(loginAfterUpdate.status).toBe(422);
      });

      it('should not update typeUser via PUT', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).put(`/user/${user._id}`).set('Authorization', `Bearer ${token}`).send({
          typeUser: 'Establishment'
        });

        const getUserResponse = await request(app).get(`/user/${user._id}`).set('Authorization', `Bearer ${token}`);

        const body = getUserResponse.body as UpdateUserResponse;

        expect(response.status).toBe(200);
        expect(body.user.typeUser).toBe('Customer');
      });
    });
  });

  describe('DELETE /users/:id', () => {
    describe('✅ Success cases', () => {
      it('should delete existing user', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app).delete(`/user/${user._id}`).set('Authorization', `Bearer ${token}`);
        const body = response.body as { message: string };

        expect(response.status).toBe(200);
        expect(body.message).toContain('User deleted successfully');
        expect(response.body.data).not.toHaveProperty('password');
      });

      it('should not be possible to login after deletion', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        await request(app).delete(`/user/${user._id}`).set('Authorization', `Bearer ${token}`);

        const loginAfterDelete = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        expect(loginAfterDelete.status).toBe(404);
      });
    });

    describe('❌ Authentication', () => {
      it('should fail without token', async () => {
        const { user } = await UserFactory.create();
        const response = await request(app).delete(`/user/${user._id}`);
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(401);
        expect(body.error.message).toContain('Access denied. No token provided.');
      });
    });

    describe('❌ Not found', () => {
      it('should fail with non-existent id', async () => {
        const { user, plainPassword } = await UserFactory.create();

        const loginResponse = await request(app).post('/login').send({
          email: user.email,
          password: plainPassword
        });

        const { token } = loginResponse.body as { token: string };
        const response = await request(app)
          .delete('/user/64f1a2b3c4d5e6f7a8b9c0d1')
          .set('Authorization', `Bearer ${token}`);
        const body = response.body as ErrorResponse;

        expect(response.status).toBe(404);
        expect(body.error.message).toContain('User not found');
      });
    });
  });
});
