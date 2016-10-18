import jwt from 'jwt-simple';

import config from './../../config/config';
import Users from './../../models/users';

describe('Routes: Users', () => {
  const jwtSecret = config.jwtSecret;
  let token;
  beforeEach(done => {
    Users
      .destroy({ where: {} })
      .then(() => Users.create({
        name: 'John',
        email: 'john@mail.net',
        password: '12345',
        role: 'admin',
      }))
      .then(user => {
        token = jwt.encode({ id: user.id }, jwtSecret);
        done();
      });
  });
  describe('GET /user', () => {
    describe('status 200', () => {
      it('returns an authenticated user', done => {
        request.get('/api/v1/users/me')
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.name).to.eql('John');
            expect(res.body.email).to.eql('john@mail.net');
            done(err);
          });
      });
    });
  });
  describe('DELETE /user', () => {
    describe('status 204', () => {
      it('deletes an authenticated user', done => {
        request.delete('/api/v1/users/me')
          .set('Authorization', `JWT ${token}`)
          .expect(204)
          .end((err, res) => done(err));
      });
    });
  });
  describe('POST /users', () => {
    describe('status 200', () => {
      it('creates a new user', done => {
        request.post('/api/v1/users')
          .set('Authorization', `JWT ${token}`)
          .send({
            name: 'Mary',
            email: 'mary@mail.net',
            password: '12345',
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body.name).to.eql('Mary');
            expect(res.body.email).to.eql('mary@mail.net');
            done(err);
          });
      });
    });
  });
});
