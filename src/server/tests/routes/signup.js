import Users from './../../models/users';
import Sessions from './../../models/sessions';

describe('Routes: Signup', () => {
  let session;
  before(done => {
    Sessions.destroy({ where: {} })
    .then(() => {
      return Users.destroy({ where: {} });
    })
    .then(() => {
      done();
    });
  });
  describe('POST /signup', () => {
    describe('status 200', () => {
      it('returns partial user and session', done => {
        request.post('/api/v1/signup')
          .send({
            username: 'jhon',
            email: 'jhon.doe@yopmail.com',
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body.User.username).to.eql('jhon');
            expect(res.body.User.email).to.eql('jhon.doe@yopmail.com');
            expect(res.body.Session.authToken).to.not.be.undefined;
            done(err);
          });
      });
    });
  });
  describe('GET /signup/validate/:token', () => {
    describe('status 200', () => {
      it('validate signup token (email validation)', done => {
        Users.findOne({ where: { email: 'jhon.doe@yopmail.com' } })
          .then(User => {
            request.get(`/api/v1/signup/validate/${User.dataValues.tokenValidate}`)
            .expect(200)
            .end((err, res) => {
              expect(res.body.User.username).to.eql('jhon');
              expect(res.body.User.email).to.eql('jhon.doe@yopmail.com');
              expect(res.body.User.status).to.eql('validated');
              expect(res.body.msg).to.eql('Your email account was validated');
              expect(res.body.Session.authToken).to.not.be.undefined;
              //
              session = res.body.Session;
              //
              done(err);
            });
          })
          .catch(err => {
            done(err);
          });
      });
    });
  });
  describe('POST /signup/profile', () => {
    describe('status 200', () => {
      it('store user basic profile, expect error for not matching passwords', done => {
        request.post('/api/v1/signup/profile')
          .set('Authorization', `JWT ${session.authToken}`)
          .send({
            password: 'P@ssword!',
            verifyPassword: 'OtherPassword#',
          })
          .expect(412)
          .end((err, res) => {
            expect(res.body.msg).to.eql('Passwords must match');
            done(err);
          });
      });
    });
  });
  describe('POST /signup/profile', () => {
    describe('status 200', () => {
      it('store user basic profile, expect error for password to short', done => {
        request.post('/api/v1/signup/profile')
          .set('Authorization', `JWT ${session.authToken}`)
          .send({
            password: 'short',
            verifyPassword: 'short',
          })
          .expect(412)
          .end((err, res) => {
            expect(res.body.msg).to.eql('Password too short');
            done(err);
          });
      });
    });
  });
  describe('POST /signup/profile', () => {
    describe('status 200', () => {
      it('store user basic profile', done => {
        request.post('/api/v1/signup/profile')
          .set('Authorization', `JWT ${session.authToken}`)
          .send({
            password: 'P@ssword!',
            verifyPassword: 'P@ssword!',
            firstName: 'Jhon',
            lastName: 'Doe',
          })
          .expect(200)
          .end((err, res) => {
            expect(res.body.Session).to.not.be.undefined;
            expect(res.body.User).to.not.be.undefined;
            expect(res.body.msg).to.eql('Your profile was saved');
            expect(res.body.User.username).to.eql('jhon');
            expect(res.body.User.email).to.eql('jhon.doe@yopmail.com');
            expect(res.body.User.firstName).to.eql('Jhon');
            expect(res.body.User.lastName).to.eql('Doe');
            expect(res.body.User.status).to.eql('not_active');
            session = res.body.Session;
            done(err);
          });
      });
    });
  });
  describe('POST /signup/profile', () => {
    describe('status 200', () => {
      it('store user basic profile, expect error when profile already stored', done => {
        request.post('/api/v1/signup/profile')
          .set('Authorization', `JWT ${session.authToken}`)
          .send({
            password: 'P@ssword!',
            verifyPassword: 'P@ssword!',
            firstName: 'Jhon',
            lastName: 'Doe',
          })
          .expect(412)
          .end((err, res) => {
            expect(res.body.msg).to.eql('Invalid user status');
            done(err);
          });
      });
    });
  });
  describe('POST /signup/activate', () => {
    describe('status 200', () => {
      it('activate user account after fill user profile', done => {
        request.post('/api/v1/signup/activate')
          .set('Authorization', `JWT ${session.authToken}`)
          .expect(200)
          .end((err, res) => {
            expect(res.body.msg).to.eql('Welcome Jhon Doe!');
            expect(res.body.User.status).to.eql('active');
            done(err);
          });
      });
    });
  });
  describe('POST /signup/activate', () => {
    describe('status 200', () => {
      it('try to activate user account when already active or invalid status', done => {
        request.post('/api/v1/signup/activate')
          .set('Authorization', `JWT ${session.authToken}`)
          .expect(412)
          .end((err, res) => {
            expect(res.body.msg).to.eql('Invalid user');
            done(err);
          });
      });
    });
  });
});
