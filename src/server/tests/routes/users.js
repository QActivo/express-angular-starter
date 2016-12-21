import jwt from 'jwt-simple';
import config from './../../config/config';
import Users from './../../models/users';
import Sessions from './../../models/sessions';
import sessionsService from './../../services/sessions';

describe('Routes: Users', () => {
  let token;
  beforeEach(done => {
    Sessions.destroy({ where: {} })
     .then(() => {
       return Users.destroy({ where: {} });
     })
    .then(() => Users.create({
      username: 'John',
      email: 'john@mail.net',
      password: '12345',
      role: 'admin',
      status: 'active',
    }))
    .then(user => {
      return sessionsService.createNewSession(user);
    })
    .then(Session => {
      token = jwt.encode(Session.authToken, config.jwtSecret);
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
            expect(res.body.username).to.eql('John');
            expect(res.body.email).to.eql('john@mail.net');
            done(err);
          });
      });
    });
  });
  describe('GET /users', () => {
    describe('status 200', () => {
      it('returns all users', done => {
        request.get('/api/v1/users')
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.count).to.eql(1);
            expect(res.body.rows[0].username).to.eql('John');
            done(err);
          });
      });
    });
  });
  describe('POST /users', () => {
    describe('status 200', () => {
      it('creates a new user', done => {
        request.post('/api/v1/users')
          .set('Authorization', `JWT ${token}`)
          .send({
            username: 'Mary',
            email: 'mary@mail.net',
            password: '12345',
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body.username).to.eql('Mary');
            expect(res.body.email).to.eql('mary@mail.net');
            done(err);
          });
      });
    });
  });
  describe('GET /users', () => {
    describe('status 200', () => {
      it('returns users with params', done => {
        request.get('/api/v1/users?limit=1&page=1&filter=John')
          .set('Authorization', `JWT ${token}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.count).to.eql(1);
            expect(res.body.rows[0].username).to.eql('John');
            done(err);
          });
      });
    });
  });
});
