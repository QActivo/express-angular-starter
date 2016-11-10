import Users from './../../models/users';
import Sessions from './../../models/sessions';

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
