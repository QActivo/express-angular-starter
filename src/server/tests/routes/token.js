import jwt from 'jwt-simple';
import config from './../../config/config';
import Users from './../../models/users';
import Sessions from './../../models/sessions';
import Tokens from './../../services/tokens';

describe('Routes: Token', () => {
  describe('POST /token', () => {
    beforeEach(done => {
      Sessions.destroy({ where: {} })
      .then(() => {
        return Users.destroy({ where: {} });
      })
      .then(() => Users.create({
        username: 'John',
        email: 'john@mail.net',
        password: '12345',
        emailValidate: 1,
        status: 'active',
      }))
      .then(user => {
        done();
      })
      .catch(err => {
        done(err);
      });
    });
    describe('status 200', () => {
      it('returns authenticated user token', done => {
        request.post('/api/v1/signin')
          .send({
            identification: 'john@mail.net',
            password: '12345',
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body.Session).to.include.keys('authToken');
            done(err);
          });
      });
      it('user session signout', done => {
        Tokens.signin({
          identification: 'john@mail.net',
          password: '12345',
        })
        .then(data => {
          expect(data.User).to.not.be.undefined;
          expect(data.User.username).to.eql('John');
          expect(data.User.email).to.eql('john@mail.net');
          expect(data.Session).to.not.be.undefined;
          expect(data.Session.authToken).to.not.be.undefined;
          const auth = jwt.encode(data.Session.authToken, config.jwtSecret);
          request.post('/api/v1/signout')
          .set('Authorization', `JWT ${auth}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.msg).to.eql('Signout Successfully');
            Sessions.count().then(count => {
              expect(count).to.eql(0);
              done(err);
            })
            .catch(error => {
              done(error);
            });
          });
        })
        .catch(err => {
          done(err);
        });
      });
      it('all user sessions logout', done => {
        let auth;
        Tokens.signin({
          identification: 'john@mail.net',
          password: '12345',
        })
        .then(data => {
          return Tokens.signin({
            identification: 'john@mail.net',
            password: '12345',
          });
        })
        .then(data => {
          expect(data.User).to.not.be.undefined;
          expect(data.User.username).to.eql('John');
          expect(data.User.email).to.eql('john@mail.net');
          expect(data.Session).to.not.be.undefined;
          expect(data.Session.authToken).to.not.be.undefined;
          auth = jwt.encode(data.Session.authToken, config.jwtSecret);

          return Sessions.count();
        })
        .then(count => {
          expect(count).to.eql(2);

          request.post('/api/v1/signout/all')
          .set('Authorization', `JWT ${auth}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.msg).to.eql('Sessions closed');
            Sessions.count().then(finalCount => {
              expect(finalCount).to.eql(0);
              done(err);
            })
            .catch(error => {
              done(error);
            });
          });
        })
        .catch(err => {
          done(err);
        });
      });
    });
    describe('status 401', () => {
      it('throws error when password is incorrect', done => {
        request.post('/api/v1/signin')
          .send({
            identification: 'john@mail.net',
            password: 'WRONG_PASSWORD',
          })
          .expect(412)
          .end((err, res) => {
            done(err);
          });
      });
      it('throws error when email not exist', done => {
        request.post('/api/v1/signin')
          .send({
            identification: 'wrong@email.com',
            password: '12345',
          })
          .expect(412)
          .end((err, res) => {
            done(err);
          });
      });
      it('throws error when email and password are blank', done => {
        request.post('/api/v1/signin')
          .expect(412)
          .end((err, res) => {
            done(err);
          });
      });
    });
  });
});
